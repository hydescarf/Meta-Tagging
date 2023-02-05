

var Tag = new class{	
	category_id = {};
	// category_list = []; //not used
	
	group_id = {};
	group_list = [];
	current_group_id = "";
	
	edit_mode = false;
	group_rename_mode = false;
	tag_input_list = ["button", "textarea"];
	tag_input_mode = 0; 
	
	
	update_tag( element, id, cancel=false ){
		if( !cancel && element.value != "" ){
			this.category_id[id].tag += element.value;
			this.category_id[id].tag = UpdateTags(this.category_id[id].tag);
			element.value = "";
			element.focus();
			SaveLoad.save_category();
		}
		else{ // If cancel with "esc key", reset value first only, but if there's no value input, then "blur" it.
			if( element.value != "" ) element.blur();
			element.value = "";
		}
	}
	update_tag_textarea( element, id, cancel=false ){
		if( !cancel ){
			this.category_id[id].tag = UpdateTags(this.category_id[id].tag);
			element.value = this.category_id[id].tag;
			SaveLoad.save_category();
		}
		else{
			element.blur();
		}
	}
	delete_tag( name, id ){
		if( !this.edit_mode ) return;
		let temp = ";" + this.category_id[id].tag + ";";
		log(temp)
		let replaced = temp.replace(";"+name+";", ";");
		log(replaced)
		if( replaced[0] == ";" )
			replaced = replaced.slice(1);
		
		log(replaced)
		this.category_id[id].tag = UpdateTags(replaced);
		SaveLoad.save_category();
	}
	
	
	add_all_tags( category_id ){
		let tag_array = this.category_id[category_id].tag;
		
		Item.selected_item_id.forEach(( id )=>{
			Item.item_id[id].metadata.tag += tag_array;
			Item.item_id[id].metadata.tag = UpdateTags(Item.item_id[id].metadata.tag);
		});
	}
	remove_all_tags( category_id ){
		let tag_array = SplitTags(this.category_id[category_id].tag);
		
		tag_array.forEach(( name )=>{
			Item.delete_tag( name );
		});
	}
	
	
	
	
	rename_category( element, id, cancel=false ){
		if( !cancel ){
			if( element.value != this.category_id[id].name ){ //wait a bit and scroll to renamed part as it is sorted after rename
				setTimeout(()=>{ element.parentElement.parentElement.scrollIntoView({behavior:"smooth", block:"nearest", inline:"nearest"}); },1);
			}
			this.category_id[id].name = element.value;
			SaveLoad.save_category();
		}
		else{
			element.value = this.category_id[id].name;
		}
		
		element.blur();
		this.category_id[id].renamed = true;
		this.sort_category();
	}	
	rename_group( element, id=this.current_group_id, cancel=false ){
		if( !cancel ){
			this.group_id[id].name = element.value;
			SaveLoad.save_group();
		}
		else{
			element.value = this.group_id[id].name;
		}
		
		element.blur();
		// this.group_rename_mode = false;
		this.sort_group();
	}
	
	
	create_category( name="", loop_id=0 ){
		let id = Date.now()+loop_id;
		let data = {
			id:id,
			name:name,
			tag:"",
			group:this.current_group_id,
			minimize:false,
			renamed:false,
		};
		this.category_id[id] = data;
		// this.category_list.push(id);
		this.group_id[this.current_group_id].category.push(id);
		SaveLoad.save_category();
		SaveLoad.save_group();
		SaveLoad.save_other();
	}
	create_group( name="", loop_id=0 ){
		let id = Date.now()+loop_id;
		let data = {
			id:id,
			name:name,
			category:[],
		};
		this.group_id[id] = data;
		this.group_list.push(id);
		this.current_group_id = id;
		SaveLoad.save_group();
		SaveLoad.save_other();
	}
	
	remove_category_call( id, group_id=this.current_group_id ){
		Modal.Dialogue.call( "Deletion", `${Language.get_text("Dialogue.Delete.item_name_category")} "${this.category_id[id].name}"`, ()=>{ this.remove_category(id, group_id); Modal.close(); } );
	}
	remove_category( id, group_id=this.current_group_id, skip_group=false ){
		// deregister category from parent group first, then remove from all category list, finally remove category id itself
		if( !skip_group ){
			for(let i = 0; i < this.group_id[group_id].category.length; i++){
				if( this.group_id[group_id].category[i] == id ){
					this.group_id[group_id].category.splice(i,1);
					break;
				}
			}
		}
		
		// for(let i = 0; i < this.category_list.length; i++){
			// if( this.category_list[i] == id ){
				// this.category_list.splice(i,1);
				// break;
			// }
		// }
		delete this.category_id[id];
		SaveLoad.save_category();
		SaveLoad.save_group();
		SaveLoad.save_other();
	}
	
	remove_group_call( id=this.current_group_id ){
		Modal.Dialogue.call( "Deletion", `${Language.get_text("Dialogue.Delete.item_name_group")} "${this.group_id[id].name}"`, ()=>{ this.remove_group(id); Modal.close(); } );
	}
	remove_group( id=this.current_group_id ){
		// delete all children categories first (skip_group=true to skip double deletion), then remove from group list and finally group id itself
		for(let i = 0; i < this.group_id[id].category.length; i++){
			this.remove_category(this.group_id[id].category[i], id, true)
		}
		
		for(let i = 0; i < this.group_list.length; i++){
			if( this.group_list[i] == id ){
				this.group_list.splice(i,1);
				break;
			}
		}
		
		delete this.group_id[id];
		this.current_group_id = this.group_list[0] || "";
		SaveLoad.save_category();
		SaveLoad.save_group();
		SaveLoad.save_other();
	}
	
	
	sort_category( id=this.current_group_id ){
		this.group_id[id].category.sort(( a, b )=>{
			return this.category_id[a].name.localeCompare(this.category_id[b].name, undefined, {numeric: true, sensitivity: 'base' });
		})
		SaveLoad.save_group();
	}
	sort_group(){
		this.group_list.sort(( a, b )=>{
			return this.group_id[a].name.localeCompare(this.group_id[b].name, undefined, {numeric: true, sensitivity: 'base' });
		})
		SaveLoad.save_group();
	}
	
	
	check_renamed_yet( dom, id ){
		if( !this.category_id[id].renamed ) dom.focus();
	}
	
	
	
	
	
	toggle_tag_input_mode(){
		this.tag_input_mode += this.tag_input_mode >= 1 ? -1 : 1; // if X >= 1; -1 to return to 0; else +1
		SaveLoad.save_other();
	}
	get_tag_input_mode(){
		return this.tag_input_list[this.tag_input_mode];
	}
	
	
	toggle_edit_mode(){
		this.edit_mode = !this.edit_mode;
	}
	is_editing(){
		return this.edit_mode;
	}
	get_edit_status(){
		return this.edit_mode ? "_editing" : "";
	}
	is_disabled(){
		return this.edit_mode ? "_disabled" : "";
	}
	is_group_available(){
		return this.current_group_id ? "" : "_disabled";
	}
	is_current_group( id ){
		return this.current_group_id == id;
	}
	
	toggle_group_rename_mode(){
		this.group_rename_mode = !this.group_rename_mode;
	}
	is_group_renaming(){
		return this.group_rename_mode;
	}
	get_group_rename_status(){
		return this.group_rename_mode ? "_group_renaming" : "";
	}
	
	get_tag_count( id ){
		return GetTagsCount(this.category_id[id].tag);
	}
	
	
	
	toggle_minimize( dom, id ){
		this.category_id[id].minimize = !this.category_id[id].minimize;
		dom.target.classList.toggle("_spin_minimize2");
		SaveLoad.save_category();
	}
	is_minimized( id ){
		return this.category_id[id].minimize;
	}
	get_minimize_status( id ){
		return this.category_id[id].minimize ? "_minimized" : "";
	}
	get_minimize_status_opacity( id ){
		return this.category_id[id].minimize ? "_minimized_opacity" : "";
	}
	
}


var Tag_Layout_Listing_Input = new class{
	view(vnode){
		var _THIS = Item;
		
		let tag_array = "";
		_THIS.selected_item_id.forEach(( id )=>{
			tag_array += _THIS.item_id[id].metadata.tag + ";";
		});
		
		tag_array = CompareTags(tag_array, _THIS.selected_item_id.size, true);
		tag_array = SplitTags(tag_array);
		
		return tag_array.map(( tag_name )=>{
			return m("div", {key:tag_name, class:"tag input_tag "+Tag.is_disabled(), onclick:()=>{ _THIS.delete_tag( tag_name, vnode.attrs.item ); }}, [
				m("span", tag_name),
				m("svg", m.trust(IconPacks["close"])),
			]);
		})
	}
}

var Tag_Layout_Listing_Compare = new class{
	view(vnode){
		var _THIS = Item;
		
		let tag_array = "";
		_THIS.selected_item_id.forEach(( id )=>{
			tag_array += _THIS.item_id[id].metadata.tag + ";";
		});
		
		tag_array = CompareTags(tag_array, _THIS.selected_item_id.size);
		tag_array = SplitTags(tag_array);
		
		return tag_array.map(( tag_name )=>{
			return m("div", {key:tag_name, class:"tag "+Tag.is_disabled(), onclick:()=>{ _THIS.add_used_tag( tag_name ); }, onmouseover:()=>{ _THIS.find_item_with_tag( tag_name ); }, onmouseout:()=>{ _THIS.reset_hovering_tag(); }}, [
				m("span", tag_name),
				// m("svg", m.trust(IconPacks["close"])),
			]);
		})
	}
}


var Tag_Layout_Listing_Library = new class{
	view(vnode){
		var _THIS = Tag;
		let tag_array = SplitTags(_THIS.category_id[vnode.attrs.category_id].tag);
		
		return tag_array.map(( tag_name )=>{
			return m("div", {key:tag_name, class:"tag", onclick:()=>{ _THIS.is_editing() ? _THIS.delete_tag( tag_name, vnode.attrs.category_id ) : Item.add_used_tag( tag_name ); }}, [
				m("span", tag_name),
				m("svg", m.trust(IconPacks["close"])),
			]);
		})
	}
}


var Tag_Category_Layout = new class{
	view(vnode){
		var _THIS = Tag;
		if( !_THIS.current_group_id ) return "";
		
		var current_group = _THIS.group_id[_THIS.current_group_id];
		return current_group.category.map(( category_id, index )=>{
			let category = _THIS.category_id[category_id];
			return m("div", {class:"tag_category ", key:category_id}, [
				m("hr"),
				m("div", {class:"_horizontal "+_THIS.get_minimize_status_opacity( category_id )},[
					m(Button, {class:"_spin_minimize", onclick:(dom)=>{ _THIS.toggle_minimize( dom, category_id ); }, icon:"down"}),
					( _THIS.is_editing() ? [
						m("input", {oncreate:({dom})=>{ dom.value = category.name; _THIS.check_renamed_yet(dom, category_id); }, placeholder:"Category",
							onkeydown:(e)=>{ 
								if( e.keyCode == 13 ) _THIS.rename_category( e.target, category_id );
								if( e.keyCode == 27 ) _THIS.rename_category( e.target, category_id, true );
							},
							onblur:(e)=>{ _THIS.rename_category( e.target, category_id ); },
						}),
						m(Button, {class:"_slide-right _type-warning", onclick:()=>{ _THIS.remove_category_call( category_id ); }, icon:"delete"}),
					] : [
						m("span", {class:"container_title category_title"}, category.name + " ("+_THIS.get_tag_count( category_id )+")"),
						m(Button, {class:"_slide-left _stay-right", onclick:()=>{ _THIS.add_all_tags( category_id ); }, disabled:_THIS.is_minimized( category_id ) || !Item.has_selected_item(), tooltip:Language.get_text("LibraryPane.tooltip_insert_tag"), icon:"copy_up"}),
						m(Button, {class:"_slide-left", onclick:()=>{ _THIS.remove_all_tags( category_id ); }, disabled:_THIS.is_minimized( category_id ) || !Item.has_selected_item(), tooltip:Language.get_text("LibraryPane.tooltip_remove_tag"), icon:"remove_down"}),
					]),
				]),
				( _THIS.is_editing() ? [
					( _THIS.get_tag_input_mode() == "button" ? [
						m("div", {class:"_horizontal _slide-down "+_THIS.get_minimize_status( category_id )},[
							m("span", {class:"container_title"}, Language.get_text("LibraryPane.tag")+" ("+_THIS.get_tag_count( category_id )+")"),
								m("input", {
									onkeydown:(e)=>{ 
										if( e.keyCode == 13 ) _THIS.update_tag( e.target, category_id );
										if( e.keyCode == 27 ) _THIS.update_tag( e.target, category_id, true );
									},
								}),
								m(Button, {class:"", onclick:(dom)=>{ _THIS.update_tag( dom.target.parentElement.children[1], category_id ); }, icon:"add"}),
								// m(Button, {class:"", onclick:()=>{ }, tooltip:"Paste tags", icon:"paste"}),
								// m(Button, {class:"", onclick:()=>{ }, text:"Copy all tags", icon:"copy"}),
						])
					] : [
						m("div", {class:"_slide-down "+_THIS.get_minimize_status( category_id )},[
							m("span", {class:"container_title"}, Language.get_text("LibraryPane.tag")+" ("+_THIS.get_tag_count( category_id )+")"),
							m("textarea", {spellcheck:false, value:category.tag,
								onkeydown:(e)=>{ 
									if( e.keyCode == 13 ) _THIS.update_tag_textarea( e.target, category_id );
									if( e.keyCode == 27 ) _THIS.update_tag_textarea( e.target, category_id, true );
								},
								oninput:(e)=>{ category.tag = e.target.value; },
								onblur:(e)=>{ _THIS.update_tag_textarea( e.target, category_id ); },
							}),
						])
					]),
				] : []),
				( !_THIS.is_editing() || _THIS.get_tag_input_mode() == "button" ? [
					m("div", {class:"_horizontal tag_listing "+_THIS.get_minimize_status( category_id )},[
						m(Tag_Layout_Listing_Library, {category_id:category_id})
					]),
				] : []),
			])
		});
	}
}

var Tag_Group_Layout = new class{
	rename_issue_prevent( e ){
		GET("ID_GroupRename");
		GET("ID_NewGroupButton");
		GET("ID_GroupRenameButton");
		
		if( e.target == ID_NewGroupButton ){ // prevent rename_input to defocus (by going through function below)
			Tag.group_rename_mode = true;
			return;
		};
		
		if( ( e.target != ID_GroupRenameButton && e.target != ID_GroupRename ) && Tag.is_group_renaming() ){
			// if input is focused, and user click on rename button to deactivate, the input will be blurred first (on mousedown on button),
			// causing the button to activate the input-focus again when clicked (on mouseup on button)
			Tag.group_rename_mode = false;
			m.redraw();
		}
	}
	oncreate(vnode){
		document.addEventListener("click", vnode.state.rename_issue_prevent);
	}
	view(vnode){
		var _THIS = Tag;
		return [
			m("div", {class:"_horizontal"},[
				( _THIS.is_editing() ? [
					m("span", {class:"container_title"}, Language.get_text("LibraryPane.group")),
					( _THIS.is_group_renaming() ? [
						m("input", {id:"ID_GroupRename", oncreate:({dom})=>{ dom.focus(); dom.value = _THIS.group_id[_THIS.current_group_id].name; },
							onkeydown:(e)=>{ 
								if( e.keyCode == 13 ){ _THIS.rename_group( e.target ); _THIS.group_rename_mode = false; }
								if( e.keyCode == 27 ){ _THIS.rename_group( e.target, _THIS.current_group_id, true ); _THIS.group_rename_mode = false; }
							},
							onblur:(e)=>{ _THIS.rename_group( e.target, _THIS.current_group_id ); },
						}),
					] : [
						m("select", {onchange:(e)=>{ _THIS.current_group_id = e.target.value; }}, [
							_THIS.group_list.map(( group_id, index )=>{
								let group = _THIS.group_id[group_id];
								return m("option", {key:group_id, value:group_id, selected:_THIS.is_current_group( group_id )}, group.name);
							})
						]),
					]),
					m(Button, {id:"ID_GroupRenameButton", class:"_slide-right group_rename_button "+_THIS.get_group_rename_status(), onclick:()=>{ _THIS.toggle_group_rename_mode(); }, disabled:_THIS.is_group_available(), tooltip:Language.get_text("LibraryPane.tooltip_rename"), icon:"rename"}),
					m(Button, {class:"_slide-right _type-warning-hover", onclick:()=>{ _THIS.remove_group_call(); }, disabled:_THIS.is_group_available(), tooltip:Language.get_text("LibraryPane.tooltip_delete"), icon:"delete"}),
					m(Button, {id:"ID_NewGroupButton", class:"_slide-right", onclick:()=>{ _THIS.create_group( Language.get_text("LibraryPane.new_group") ); _THIS.toggle_group_rename_mode(); }, tooltip:Language.get_text("LibraryPane.tooltip_add"), icon:"add"}),
				] : [
					m("span", {class:"container_title"}, Language.get_text("LibraryPane.title")),
					m("select", {onchange:(e)=>{ _THIS.current_group_id = e.target.value; }}, [
						_THIS.group_list.map(( group_id, index )=>{
							let group = _THIS.group_id[group_id];
							return m("option", {key:group_id, value:group_id, selected:_THIS.is_current_group( group_id )}, group.name);
						})
					]),
				]),
				m(Button, {class:"_stay-right edit_button", onclick:()=>{ _THIS.toggle_edit_mode(); }, icon:"edit"}),
			]),
			
			( _THIS.is_editing() ? [
				m("div", {class:"_horizontal _slide-down _stay-center"},[
					m(Button, {class:"spin_animation", onclick:(dom)=>{ Tag.toggle_tag_input_mode(); dom.target.classList.toggle("spin_animation2") }, disabled:_THIS.is_group_available(), text:Language.get_text("LibraryPane.button_switch_input"), icon:"refresh"}),
					m(Button, {class:"", onclick:()=>{ _THIS.create_category( Language.get_text("LibraryPane.new_category") ); }, disabled:_THIS.is_group_available(), text:Language.get_text("LibraryPane.button_add_category"), icon:"add"}),
				]),
			] : [])
		]
	}
}





