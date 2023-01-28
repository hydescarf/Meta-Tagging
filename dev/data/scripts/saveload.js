var SaveLoad = new class{
	path_category = "data/savedata/savedata_category.json";
	path_group = "data/savedata/savedata_group.json";
	path_other = "data/savedata/savedata_other.json";
	
	save_other(){
		var fs = require("fs");
		let data = {
			// category_list:			Tag.category_list,
			group_list:				Tag.group_list,
			current_group_id:		Tag.current_group_id,
			tag_input_mode:			Tag.tag_input_mode,
			
			current_language_id:	Language.current_language_id,
			item_visibility_mode:	App.item_visibility_mode,
			item_size_mode:			App.item_size_mode,
			theme_mode:				App.theme_mode,
		};
		fs.writeFileSync( this.path_other, JSON.stringify(data), "utf8" );
	}
	save_category(){
		var fs = require("fs");
		let data = { category_id: Tag.category_id, };
		fs.writeFileSync( this.path_category, JSON.stringify(data), "utf8" );
	}
	save_group(){
		var fs = require("fs");
		let data = { group_id: Tag.group_id, };
		fs.writeFileSync( this.path_group, JSON.stringify(data), "utf8" );
	}
	
	load(){
		var fs = require("fs");
		fs.access(this.path_other, fs.F_OK, (err)=>{
			if(err){ this.save_other(); }
		})
		fs.access(this.path_category, fs.F_OK, (err)=>{
			if(err){ this.save_category(); }
		})
		fs.access(this.path_group, fs.F_OK, (err)=>{
			if(err){ this.save_group(); }
		})
		
		let data = fs.readFileSync(this.path_other);
		data = JSON.parse(data);
		
		// Tag.category_list = 		structuredClone( data.category_list );
		Tag.group_list = 			structuredClone( data.group_list );
		Tag.current_group_id =	 	structuredClone( data.current_group_id );
		Tag.tag_input_mode =	 	structuredClone( data.tag_input_mode );
		
		Language.current_language_id = 	structuredClone( data.current_language_id );
		App.item_visibility_mode = 	structuredClone( data.item_visibility_mode );
		App.item_size_mode = 		structuredClone( data.item_size_mode );
		App.theme_mode = 			structuredClone( data.theme_mode );
		
		
		data = fs.readFileSync(this.path_category);
		data = JSON.parse(data);
		Tag.category_id = structuredClone( data.category_id );
		
		
		data = fs.readFileSync(this.path_group);
		data = JSON.parse(data);
		Tag.group_id = structuredClone( data.group_id );
		
		m.redraw();
	}
	
	reset(){
		Tag.category_id = {};
		Tag.group_id = {};
		// Tag.category_list = [];
		Tag.group_list = [];
		Tag.current_group_id = "";
		Tag.tag_input_mode = 0;
		
		Language.current_language_id = "English";
		App.item_visibility_mode = 0;
		App.item_size_mode = 1;
		App.theme_mode = 0;
	}
	
}