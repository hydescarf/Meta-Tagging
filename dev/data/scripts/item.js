
var Item = new class{
	item_id = {};
	item_list = [];
	selected_item_id = new Set();
	selected_item_index_anchor = 0;
	is_shift_hold = false;
	is_ctrl_hold = false;
	is_section_focused = false;
	
	hovering_item_id = new Set();
	
	create( name, path, metadata, loop_id=0 ){
		let id = path; //Date.now()+loop_id;
		let data = {
			id:id,
			name:name,
			path:path,
			img:"",
			metadata:{
				title:metadata.title,
				description:metadata.description,
				tag:metadata.tag
			}
		};
		this.item_id[id] = data;
		this.item_id[id].img = this.create_thumbnail(path, id);
		this.item_list.push(id);
	}
	
	
	
	
	create_thumbnail( path, id ){
		var image = new Image();
		var url = path;
		image.onload = ()=>{
			var canvas = document.createElement("canvas");
			var ctx = canvas.getContext("2d");
			canvas.width = 250;
			canvas.height = Math.floor(image.naturalHeight * (250 / image.naturalWidth));
			if( canvas.height > 250 ){
				canvas.width = Math.floor(image.naturalWidth * (250 / image.naturalHeight));
				canvas.height = 250;
			}
			ctx.drawImage(image, 0, 0, image.naturalWidth, image.naturalHeight, 0, 0, canvas.width, canvas.height);
			
			this.item_id[id].img = canvas.toDataURL();
			m.redraw();
		}
		image.src = url;
	}
	
	
	
	
	
	update_tag( element, item, cancel=false ){
		if( !cancel && element.value != "" ){
			this.selected_item_id.forEach(( id )=>{
				this.item_id[id].metadata.tag += element.value;
				this.item_id[id].metadata.tag = UpdateTags(this.item_id[id].metadata.tag);
			});
			element.value = "";
			element.focus();
		}
		else{ // If cancel with "esc key", reset value first only, but if there's no value input, then "blur" it.
			if( element.value != "" ) element.blur();
			element.value = "";
		}
	}
	update_tag_textarea( element, item, cancel=false ){
		if( !cancel ){
			this.selected_item_id.forEach(( id )=>{
				this.item_id[id].metadata.tag = UpdateTags(item.metadata.tag);
			});
			element.value = item.metadata.tag;
		}
		else{
			element.blur();
		}
	}
	delete_tag( name, item ){
		if( Tag.edit_mode ) return;
		this.selected_item_id.forEach(( id )=>{
			let temp = ";" + this.item_id[id].metadata.tag + ";";
			let replaced = temp.replace(";"+name+";", ";");
			if( replaced[0] == ";" )
				replaced = replaced.slice(1);
			this.item_id[id].metadata.tag = UpdateTags(replaced);
		});
	}
	add_used_tag( name ){
		this.selected_item_id.forEach(( id )=>{
			this.item_id[id].metadata.tag += name;
			this.item_id[id].metadata.tag = UpdateTags(this.item_id[id].metadata.tag);
		});
	}
	add_all_tags(){
		let tag_array = "";
		this.selected_item_id.forEach(( id )=>{
			tag_array += this.item_id[id].metadata.tag + ";";
		});
		this.selected_item_id.forEach(( id )=>{
			this.item_id[id].metadata.tag = UpdateTags(tag_array);
		});
	}
	remove_all_tags(){
		let tag_array = "";
		this.selected_item_id.forEach(( id )=>{
			tag_array += this.item_id[id].metadata.tag + ";";
		});
		tag_array = CompareTags( tag_array, this.selected_item_id.size, true );
		this.selected_item_id.forEach(( id )=>{
			this.item_id[id].metadata.tag = UpdateTags(tag_array);
		});
	}
	
	
	
	update_value( element, type, item ){ // title and description, exclude tag
		this.selected_item_id.forEach(( id )=>{
			this.item_id[id].metadata[type] = element.value;
		});
	}
	
	
	
	remove_item_call(){
		let title = "";
		if( this.selected_item_id.size == 1 ){
			title = `${Language.get_text("Dialogue.Delete.item_name_item")} "${this.item_id[this.selected_item_id.values().next().value].name}"`
		}
		else if( this.selected_item_id.size > 1 ){
			title = `${Language.get_text("Dialogue.Delete.item_name_item_multiple")} (${this.selected_item_id.size})`
		}
		Modal.Dialogue.call( "Deletion", title, ()=>{ this.remove_item(); Modal.close(); } );
	}
	remove_item(){
		this.selected_item_id.forEach(( id )=>{
			for(let i = 0; i < this.item_list.length; i++){
				if( this.item_list[i] == id ){
					this.item_list.splice(i,1);
					break;
				}
			}
			delete this.item_id[id];
		});
		this.selected_item_id.clear();
	}
	
	
	
	
	
	select_item( index, item ){
		// during shift, first find the start index & end index for for-loop
		// exchange value if start index is bigger than end index
		// clear all list first, then search for items in between latest selected index & firstly selected anchored index
		if( this.is_shift_hold ){
			let start_index = this.selected_item_index_anchor;
			let end_index = index;
			if( start_index > end_index ){
				end_index = start_index;
				start_index = index;
			}
			
			this.selected_item_id.clear();
			for( let i = start_index; i <= end_index; i++ ){
				let id = this.item_id[this.item_list[i]].id;
				this.selected_item_id.add(id);
			}
		}
		// during ctrl, if selected item is already selected, deselect it instead (dont clear all because ctrl should be a multi-click function)
		// else, select it. Then, set the anchor index on that item index
		else if( this.is_ctrl_hold ){
			if( this.selected_item_id.has(item.id) ){
				this.selected_item_id.delete(item.id);
			}
			else{
				this.selected_item_id.add(item.id);
			}
			
			this.selected_item_index_anchor = index;
		}
		// if click only without any key combo: clear other available selected items and select only the latest clicked item
		else{
			this.selected_item_id.clear();
			this.selected_item_id.add(item.id);
			this.selected_item_index_anchor = index;
		}
	}
	select_all_items(){
		for( let i = 0; i < this.item_list.length; i++ ){
			let id = this.item_id[this.item_list[i]].id;
			this.selected_item_id.add(id);
		}
	}
	
	get_selected_item( item ){
		return this.selected_item_id.has(item.id) ? " _selected" : "";
	}
	has_selected_item(){
		return this.selected_item_id.size ? true : false;
	}
	is_filled( item, type ){
		return item.metadata[type] ? "" : "_no_input_warning";
	}
	has_item(){
		return this.item_list.length > 0 ? true : false;
	}
	
	
	find_item_with_tag( tag_name ){
		this.selected_item_id.forEach(( id )=>{
			let temp = ";" + this.item_id[id].metadata.tag + ";";
			let result = temp.includes(";"+tag_name+";");
			
			if( result ) this.hovering_item_id.add(id);
		});
	}
	reset_hovering_tag(){
		this.hovering_item_id.clear();
	}
	is_hovering_tag( id ){
		return this.hovering_item_id.size ? " _hovering_tag" + ( this.hovering_item_id.has( id ) ? " _hovering_item_tag" : "" ) : "";
	}
	
}


var Item_Layout = new class{
	oncreate(vnode){
		document.addEventListener('click', (e)=>{
			Item.is_section_focused = false;
			
			// this click is for detecting whether if item_section (and its children) is clicked by checking their closest parent (including self)
			if( e.target.closest(".item_section") != null ){
				Item.is_section_focused = true;
			}
			
			if( e.target.classList.contains("item_section") && !Item.is_shift_hold && !Item.is_ctrl_hold ){
				Item.selected_item_id.clear();
				m.redraw();
			}
		});
		document.addEventListener('keydown', (e)=>{
			if( e.keyCode == 16 ){ Item.is_shift_hold = true; }
			else if( e.keyCode == 17 ){ Item.is_ctrl_hold = true; }
			else if( e.keyCode == 65 && e.ctrlKey && Item.is_section_focused ){
				Item.select_all_items();
				m.redraw();
			}
		});
		document.addEventListener('keyup', (e)=>{
			if( e.keyCode == 16 ){ Item.is_shift_hold = false; }
			else if( e.keyCode == 17 ){ Item.is_ctrl_hold = false; }
		});
	}
	
	view(vnode){
		var _THIS = Item;
		return m("div", {class:"item_section"+App.get_item_class()}, [
			_THIS.item_list.map(( item_id, index )=>{
				let item = _THIS.item_id[item_id];
				return [
					m("div", {key:item_id, class:"item "+_THIS.get_selected_item( item )+_THIS.is_hovering_tag( item_id ), onclick:()=>{ _THIS.select_item(index, item); }},[
						m("img", {class:"", src:item.img}),
						m("div", {class:"item_info"}, [
							m("div", {class:""+_THIS.is_filled( item, "title")}, Language.get_text("Item.item_title")),
							m("div", {class:""+_THIS.is_filled( item, "description")}, Language.get_text("Item.item_desc")),
							m("div", {class:"item_info_tags "+_THIS.is_filled( item, "tag")}, GetTagsCount(item.metadata.tag)),
						]),
						m("span", {class:"item_title"}, item.name)
					])
				]
			})
		])
	}
}


