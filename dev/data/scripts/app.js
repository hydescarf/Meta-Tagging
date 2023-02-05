

var App = new class{
	
	item_visibility_list = ["_none", "_visible"];
	item_visibility_mode = 0;
	
	item_size_list = ["_small", "_medium", "_large"];
	item_size_mode = 1;
	
	theme_list = ["", "theme-light", "theme-dark"];
	theme_mode = 0;
	
	
	
	
	open_file_call(){
		if( Modal.active ) return;
		ID_OpenImages.click();
	}
	async open_file( fileinput ){
		var files = fileinput.files;
		var path = require('path');
		Modal.Dialogue.call( "Loading" );
		
		let file_skip_format = 0;
		let file_skip_dupe = 0;
		let count = 0;
		Modal.Dialogue.Loading.item_name = `(${count}/${files.length})`;
		
		for(let i = 0; i < files.length; ++i){ // Read file with Node.js API
			if( path.extname(files[i].path) != ".jpg" && path.extname(files[i].path) != ".jpeg" ){
				file_skip_format++;
				Modal.Dialogue.Loading.file_skip_format = file_skip_format + " " + Language.get_text("Dialogue.Loading.skip_format");
				continue;
			}
			if( Item.item_id[files[i].path] ){//reject file that has the same path, to prevent duplicates
				file_skip_dupe++;
				Modal.Dialogue.Loading.file_skip_dupe = file_skip_dupe + " " + Language.get_text("Dialogue.Loading.skip_dupe");
				continue;
			}
			count++;
			await this.read_data( files[i], count, files.length );
		}
		Modal.Dialogue.Loading.finish_loading = true;
		Modal.force_open_mode = false;
		fileinput.value = ""; //reset value so that even if same files are chosen, it is able to be acknowledged by the system and show error instead of nothing.
	}
	async read_data( file, count, length  ){
		var exiftool = require("exiftool-vendored").exiftool;
		var result = await exiftool
			.read( file.path )
			.then( ( EXIFTags )=>{
				var metadata = {title:EXIFTags.XPTitle, description:EXIFTags.ImageDescription, tag:EXIFTags.XPKeywords || ""};
				Item.create( file.name, file.path, metadata );
				Modal.Dialogue.Loading.item_name = `(${count}/${length}) ${file.name}`;
			})
			.catch((err) => console.error("Something terrible happened: ", err));
	}
	
	
	write_file_call(){
		if( Modal.active || !Item.item_list.length ) return;
		
		m.redraw();
		Modal.Dialogue.call( "Export", "", ()=>{ this.write_file(); Modal.close(); } );
	}
	async write_file(){
		var exiftool = require("exiftool-vendored").exiftool;
		Modal.Dialogue.call( "Exporting" );
		let count = 0;
		
		for( let i = 0; i < Item.item_list.length; i++ ){
			let item = Item.item_id[Item.item_list[i]];
			let tag = item.metadata.tag.split(";"); //turn string into array
			if( tag[tag.length-1] == "" ) tag.splice(tag.length-1,1); //remove the last keyword that is empty because of ; at the end
			
			let tag_string = tag.join(";") || "";
			let title = item.metadata.title;
			let description = item.metadata.description;
			let path = item.path;
			count++;
			
			await exiftool.write(path,
				{
					"EXIF:XPTitle": title,
					"EXIF:ImageDescription": description,
					"EXIF:XPKeywords": tag_string,
					"IPTC:Headline": title,
					"IPTC:Caption-Abstract": description,
					"IPTC:Keywords": tag,
					"XMP:Title": title,
					"XMP:Description": description,
					"XMP:Subject": tag,
					"XMP:LastKeywordXMP": tag,
					"XMP:LastKeywordIPTC": tag,
				},
				['-overwrite_original','-codedcharacterset=utf8'] //prevent creation of new file
			)
			.catch((err)=>{
				console.error("Error: ", err);
				if( err.message.includes("File not found") ){
					count--;
					Modal.Dialogue.Exporting.file_not_found += Language.get_text("Dialogue.Exporting.file_not_found") + " " + item.path + "\n";
				}
			});
			
			Modal.Dialogue.Exporting.item_name = `(${count}/${Item.item_list.length}) ${item.name}`;
			await m.redraw();
		}
		Modal.Dialogue.Exporting.finish_loading = true;
		Modal.force_open_mode = false;
		this.currently_export_file = false;
	}
	
	

	
	toggle_item_size(){
		this.item_size_mode += this.item_size_mode >= 2 ? -2 : 1; // if X >= 2; -2 to return to 0; else +1
		SaveLoad.save_other();
	}
	toggle_item_visibility(){
		this.item_visibility_mode += this.item_visibility_mode >= 1 ? -1 : 1;
		SaveLoad.save_other();
	}
	
	get_item_class(){
		return " "+this.item_size_list[this.item_size_mode]+" "+this.item_visibility_list[this.item_visibility_mode];
	}
	
	
	
	is_current_theme( mode ){
		return mode == this.theme_mode;
	}
	change_theme( mode ){
		document.body.classList.remove(this.theme_list[1]);
		document.body.classList.remove(this.theme_list[2]);
		
		this.theme_mode = mode;
		if( this.theme_mode != 0 ) document.body.classList.add(this.theme_list[this.theme_mode]);
		SaveLoad.save_other();
	}
	
	affect_system_theme( e ){
		if( App.theme_mode != 0 ) return;
		if(e.matches){
			document.body.classList.remove(App.theme_list[1]);
			document.body.classList.add(App.theme_list[2]);
		}
		else{
			document.body.classList.remove(App.theme_list[2]);
			document.body.classList.add(App.theme_list[1]);
		}
	}
	
}


window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", App.affect_system_theme);
if( App.theme_mode == 0 ) App.affect_system_theme( window.matchMedia("(prefers-color-scheme: dark)") ); //since change wont be called on oncreate, call it to define the very first theme