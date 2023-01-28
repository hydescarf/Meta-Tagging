var Layout = new class{
	Main = {
		view:(vnode)=>{
			return m("div", {class:"main_layout "+Tag.get_edit_status()}, [
				m("div", {class:"layout_div layout_left"}, [
					m("div", {class:"panel library_panel"}, [
						m(Tag_Group_Layout),
						m("div", {class:"tag_category_listing"}, [
							m(Tag_Category_Layout),
						])
					]),
					
					m("div", {class:"panel info_panel"},[
						m(this.Info_Input),
						m(this.Tag_Input),
						m(this.Tag_Input_In_Used),
					]),
					
				]),
				m("div", {class:"layout_div layout_right"}, [
					m(this.Menu),
					m(Item_Layout)
				]),
				m(Modal),
				m(Tooltip),
				
			])
		}
	}
	
	
	Menu = {
		view:(vnode)=>{
			return m("div", {class:"main_menu"}, [
				m("input", {id:"ID_OpenImages", class:"file_dialog", onchange:(e)=>{ App.open_file( e.target ); }, type:"file", multiple:true, accept:"image/jpeg"}),
				m(Button, {class:"", onclick:()=>{ App.open_file_call(); }, text:Language.get_text("MenuBar.open")}),
				m(Button, {class:"", onclick:()=>{ App.write_file_call(); }, disabled:!Item.has_item(), text:Language.get_text("MenuBar.export")}),
				m(Button, {class:"", onclick:()=>{ Modal.call("Settings"); }, text:Language.get_text("MenuBar.settings")}),
				m(Button, {class:"_stay-right", onclick:()=>{ App.toggle_item_visibility(); }, icon:"visible"}),
				m(Button, {class:"", onclick:()=>{ App.toggle_item_size(); }, icon:"grid"}),
				// m(Button, {class:"", onclick:()=>{ }, icon:"sort"}),
				// m(Button, {class:"", onclick:()=>{ }, icon:"language"}),
			])
		}
	}
	
	Info_Input = {
		view:(vnode)=>{
			var _THIS = Item;
			var item = _THIS.has_selected_item() ? _THIS.item_id[_THIS.selected_item_id.values().next().value] : null;
			
			return [
				m("div", {class:"_horizontal"},[
					m("span", {class:"container_title "+Tag.is_disabled()}, Language.get_text("MainPane.title")),
					m("input", {disabled:Tag.is_editing() || !_THIS.has_selected_item(), value:(_THIS.has_selected_item() ? item.metadata.title : ""),
						onkeydown:(e)=>{ 
							if( e.keyCode == 13 ) e.target.blur();
							if( e.keyCode == 27 ) e.target.blur();
						},
						oninput:(e)=>{ _THIS.update_value(e.target, "title", item); },
					}),
					m(Button, {class:"_type-warning-hover", onclick:()=>{ _THIS.remove_item_call(); }, disabled:Tag.is_editing() || !_THIS.has_selected_item(), icon:"delete"}),
				]),
				m("div", {class:""},[
					m("span", {class:"container_title "+Tag.is_disabled()}, Language.get_text("MainPane.description")),
					m("textarea", {disabled:Tag.is_editing() || !_THIS.has_selected_item(), value:(_THIS.has_selected_item() ? item.metadata.description : ""),
						onkeydown:(e)=>{ 
							if( e.keyCode == 13 ) e.target.blur(); 
							if( e.keyCode == 27 ) e.target.blur();
						},
						oninput:(e)=>{ _THIS.update_value(e.target, "description", item); },
					}),
				]),
				m("hr"),
			]
		}
	}
	
	Tag_Input = {
		view:(vnode)=>{
			var _THIS = Item;
			var item = _THIS.has_selected_item() ? _THIS.item_id[_THIS.selected_item_id.values().next().value] : null;
			
			return [
				( Tag.get_tag_input_mode() == "button" ? [
					m("div", {class:"_horizontal"},[
						m("span", {class:"container_title "+Tag.is_disabled()}, Language.get_text("MainPane.tag")+" ("+ (_THIS.has_selected_item() ? GetTagsCount( item.metadata.tag ) : 0) +")"),
						m("input", {disabled:Tag.is_editing() || !_THIS.has_selected_item(),
							onkeydown:	(e)=>{
								if( e.keyCode == 13 ){ _THIS.update_tag(e.target, item); }
								if( e.keyCode == 27 ){ _THIS.update_tag(e.target, item, true); }
							},
						}),
						m(Button, {class:"_stay-right", onclick:(dom)=>{ _THIS.update_tag(dom.target.parentElement.children[1], item); }, disabled:Tag.is_editing() || !_THIS.has_selected_item(), icon:"add"}),
						m(Button, {class:"spin_animation", onclick:(dom)=>{ Tag.toggle_tag_input_mode(); dom.target.classList.toggle("spin_animation2") }, disabled:Tag.is_editing() || !_THIS.has_selected_item(), tooltip:Language.get_text("MainPane.tooltip_switch_input"), icon:"refresh"}),

					]),
					m("div", {class:"_horizontal tag_listing"},[
						( _THIS.has_selected_item() ? [
							m(Tag_Layout_Listing_Input, {item:item})
						] : [])
					]),
				] : [
					m("div", {class:"_horizontal _row_break"},[
						m("span", {class:"container_title "+Tag.is_disabled()}, Language.get_text("MainPane.tag")+" ("+ (_THIS.has_selected_item() ? GetTagsCount( item.metadata.tag ) : 0) +")"),
						m(Button, {class:"_stay-right spin_animation", onclick:(dom)=>{ Tag.toggle_tag_input_mode(); dom.target.classList.toggle("spin_animation2") }, disabled:Tag.is_editing() || !_THIS.has_selected_item(), tooltip:Language.get_text("MainPane.tooltip_switch_input"), icon:"refresh"}),
						m("textarea", {spellcheck:false, disabled:Tag.is_editing() || !_THIS.has_selected_item(), value:(_THIS.has_selected_item() ? item.metadata.tag : ""),
							onkeydown:(e)=>{ 
								if( e.keyCode == 13 ) _THIS.update_tag_textarea( e.target, item );
								if( e.keyCode == 27 ) _THIS.update_tag_textarea( e.target, item, true );
							},
							oninput:(e)=>{ item.metadata.tag = e.target.value; },
							onblur:(e)=>{ _THIS.update_tag_textarea( e.target, item ); },
						}),
					]),
				]),
				m("hr"),
			]
		}
	}
	
	Tag_Input_In_Used = {
		view:(vnode)=>{
			var _THIS = Item;
			var item = _THIS.has_selected_item() ? _THIS.item_id[_THIS.selected_item_id.values().next().value] : null;
			
			return [
				m("div", {class:"_horizontal"},[
					m("span", {class:Tag.is_disabled()}, Language.get_text("MainPane.tag_used")),
					m(Button, {class:"_stay-right", onclick:()=>{ _THIS.add_all_tags(); }, disabled:Tag.is_editing() || !_THIS.has_selected_item(), tooltip:Language.get_text("MainPane.tooltip_insert_tag"), icon:"copy_up"}),
					m(Button, {class:"", onclick:()=>{ _THIS.remove_all_tags(); }, disabled:Tag.is_editing() || !_THIS.has_selected_item(), tooltip:Language.get_text("MainPane.tooltip_remove_tag"), icon:"remove_down"}),

				]),
				m("div", {class:"_horizontal tag_listing"},[
					( _THIS.has_selected_item() && _THIS.selected_item_id.size > 1 ? [
						m(Tag_Layout_Listing_Compare, {item:item})
					] : [])
				]),
			]
		}
	}
	

	
}

