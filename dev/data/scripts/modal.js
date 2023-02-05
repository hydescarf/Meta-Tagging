
var Modal = new class{
	active = false;
	current_mode = "";
	force_open_mode = false;
	
	call( who ){
		this.active = true;
		this.current_mode = who;
		this.use_layout( this[who] );
	}
	close(){
		if( this.force_open_mode ) return;
		this.active = false;
	}
	get_visibility(){
		return this.active ? "" : "_hidden";
	}
	
	
	
	
	oncreate(vnode){
		GET("ID_Modal");
		document.addEventListener("keydown", (e)=>{
			if( e.keyCode == 27 ){
				Modal.close();
				m.redraw();
			}
		});
	}
	use_layout( info ){
		m.mount(ID_Modal, info);
	}
	
	view(vnode){
		return m("div", {class:"modal_background "+Modal.get_visibility(), onclick:()=>{ Modal.close(); }}, [
			m("div", {id:"ID_Modal", class:"modal modal_"+Modal.current_mode, onclick:(e)=>{ e.stopPropagation(); }})
		])
	}
	
	Dialogue = {
		QuitApp:{
			get_button1:()=>{ },
			get_button2:()=>{ Modal.close(); },
			item_name:"",
			view:(vnode)=>{
				return [
					m("span", {class:"dialogue_question"}, Language.get_text("Dialogue.QuitApp.question")),
					m("div", {class:"_horizontal dialogue_buttons"}, [
						m(Button, {class:"_type-warning", onclick:()=>{ vnode.state.get_button1(); }, oncreate:({dom})=>{ dom.focus(); }, icon:"", text:Language.get_text("Dialogue.QuitApp.button_confirm")}),
						m(Button, {class:"", onclick:()=>{ vnode.state.get_button2(); }, icon:"", text:Language.get_text("Dialogue.QuitApp.button_cancel")}),
					])
				]
			}
		},
		Deletion:{
			get_button1:()=>{ },
			get_button2:()=>{ Modal.close(); },
			item_name:"",
			view:(vnode)=>{
				return [
					m("span", {class:"dialogue_question"}, Language.get_text("Dialogue.Delete.question")),
					m("span", {class:"highlight"}, vnode.state.item_name),
					m("span", {class:"dialogue_desc"}, Language.get_text("Dialogue.Delete.desc")),
					m("div", {class:"_horizontal dialogue_buttons"}, [
						m(Button, {class:"_type-warning", onclick:()=>{ vnode.state.get_button1(); }, oncreate:({dom})=>{ dom.focus(); }, icon:"", text:Language.get_text("Dialogue.Delete.button_delete")}),
						m(Button, {class:"", onclick:()=>{ vnode.state.get_button2(); }, icon:"", text:Language.get_text("Dialogue.Delete.button_cancel")}),
					])
				]
			}
		},
		Export:{
			get_button1:()=>{ },
			get_button2:()=>{ Modal.close(); },
			item_name:"",
			view:(vnode)=>{
				return [
					m("span", {class:"dialogue_question"}, Language.get_text("Dialogue.Export.question")),
					m("span", {class:"dialogue_desc"}, Language.get_text("Dialogue.Export.desc")),
					m("div", {class:"_horizontal dialogue_buttons"}, [
						m(Button, {class:"_type-confirm", onclick:()=>{ vnode.state.get_button1(); }, oncreate:({dom})=>{ dom.focus(); }, icon:"", text:Language.get_text("Dialogue.Export.button_confirm")}),
						m(Button, {class:"", onclick:()=>{ vnode.state.get_button2(); }, icon:"", text:Language.get_text("Dialogue.Export.button_cancel")}),
					])
				]
			}
		},
		Loading:{
			oncreate:(vnode)=>{
				Modal.force_open_mode = true;
				vnode.tag.finish_loading = false;
				vnode.tag.file_skip_format = "";
				vnode.tag.file_skip_dupe = "";
			},
			
			get_button1:()=>{ Modal.close(); },
			get_button2:()=>{ },
			item_name:"",
			file_skip_format:"",
			file_skip_dupe:"",
			finish_loading:false,
			is_loading_finished:(vnode)=>{
				return vnode.tag.finish_loading;
			},
			view:(vnode)=>{
				return [
					m("span", {class:"dialogue_question"}, vnode.state.is_loading_finished(vnode) ? Language.get_text("Dialogue.Loading.text2") : Language.get_text("Dialogue.Loading.text")),
					m("span", {class:"highlight"}, vnode.state.item_name),
					m("span", {class:"dialogue_desc"}, vnode.state.file_skip_format),
					m("span", {class:"dialogue_desc"}, vnode.state.file_skip_dupe),
					m("div", {class:"_horizontal dialogue_buttons"}, [
						m(Button, {class:"_type-confirm", onclick:()=>{ vnode.state.get_button1(); }, oncreate:({dom})=>{ dom.focus(); }, disabled:!vnode.state.is_loading_finished(vnode), icon:"", text:Language.get_text("Dialogue.Loading.button_confirm")}),
						// m(Button, {class:"", onclick:()=>{ vnode.state.get_button2(); }, icon:"", text:Language.get_text("Dialogue.Confirm.button_cancel")}),
					])
				]
			}
		},
		Exporting:{
			oncreate:(vnode)=>{
				Modal.force_open_mode = true;
				vnode.tag.finish_loading = false;
				vnode.tag.file_not_found = "";
			},
			
			get_button1:()=>{ Modal.close(); },
			get_button2:()=>{ },
			item_name:"",
			file_not_found:"",
			finish_loading:false,
			is_loading_finished:(vnode)=>{
				return vnode.tag.finish_loading;
			},
			view:(vnode)=>{
				return [
					m("span", {class:"dialogue_question"}, vnode.state.is_loading_finished(vnode) ? Language.get_text("Dialogue.Exporting.text2") : Language.get_text("Dialogue.Exporting.text")),
					m("span", {class:"highlight"}, vnode.state.item_name),
					m("span", {class:"dialogue_desc dialogue_error_file"}, vnode.state.file_not_found),
					m("div", {class:"_horizontal dialogue_buttons"}, [
						m(Button, {class:"_type-confirm", onclick:()=>{ vnode.state.get_button1(); }, oncreate:({dom})=>{ dom.focus(); }, disabled:!vnode.state.is_loading_finished(vnode), icon:"", text:Language.get_text("Dialogue.Exporting.button_confirm")}),
						// m(Button, {class:"", onclick:()=>{ vnode.state.get_button2(); }, icon:"", text:Language.get_text("Dialogue.Confirm.button_cancel")}),
					])
				]
			}
		},
		
		oncreate:()=>{
			GET("ID_Dialogue");
		},
		call:( mode, item_name="", button1=undefined, button2=undefined )=>{
			Modal.call("Dialogue");
			
			Modal.Dialogue[mode].item_name = item_name; // Todo: Better way will be assigning {key:value} directly, same goes for the button as well? Not important for now.
			if( button1 ) Modal.Dialogue[mode].get_button1 = button1;
			if( button2 ) Modal.Dialogue[mode].get_button2 = button2;
			m.mount(ID_Dialogue, Modal.Dialogue[mode]);
		},
		view:(vnode)=>{
			return [
				m("div", {class:""}, [
					m("div", {class:"_horizontal modal_top"}, [
						// m("span", {class:"modal_title"}, "Delete Confirmation"),
						// m(Button, {class:"_stay-right", onclick:()=>{ Modal.close(); }, icon:"close"}),
					]),
					m("div", {id:"ID_Dialogue", class:"modal_bottom dialogue_container"})
				])
			]
		}
	}
	
	Open = {
		oncreate:()=>{
			GET("ID_OpenFolder");
			GET("ID_OpenImages");
		},
		view:(vnode)=>{
			return [
				m("div", {class:""}, [
					m("div", {class:"_horizontal modal_top"}, [
						m("span", {class:"modal_title"}, Language.get_text("Modal.Open.title")),
						m(Button, {class:"_stay-right", onclick:()=>{ Modal.close(); }, icon:"close"}),
					]),
					m("div", {class:"_horizontal modal_export_choice"}, [
						// m("input", {id:"ID_OpenFolder", class:"file_dialog", onchange:(e)=>{ Modal.close(); App.open_folder( e.target ); }, type:"file", nwdirectory:true}),
						// m("input", {id:"ID_OpenImages", class:"file_dialog", onchange:(e)=>{ Modal.close(); App.open_file( e.target ); }, type:"file", multiple:true, accept:"image/png, image/jpeg"}),
						m(Button, {class:"", onclick:()=>{ ID_OpenFolder.click(); }, icon:"folder", text:Language.get_text("Modal.Open.open_folder")}),
						m(Button, {class:"", onclick:()=>{ ID_OpenImages.click(); }, icon:"image_multiple", text:Language.get_text("Modal.Open.open_image")}),
						// m(Button, {class:"", onclick:()=>{ }, icon:"open_project", text:Language.get_text("Modal.Open.open_project")}),
					])
				])
			]
		}
	}
	
	
	Export = {
		view:(vnode)=>{
			return [
				m("div", {class:""}, [
					m("div", {class:"_horizontal modal_top"}, [
						m("span", {class:"modal_title"}, Language.get_text("Modal.Export.title")),
						m(Button, {class:"_stay-right", onclick:()=>{ Modal.close(); }, icon:"close"}),
					]),
					m("div", {class:"_horizontal modal_export_choice"}, [
						m(Button, {class:"", onclick:()=>{ }, icon:"save_file", text:Language.get_text("Modal.Export.export_project")}),
						// m(Button, {class:"", onclick:()=>{ }, icon:"image_data", text:Language.get_text("Modal.Export.export_metadata")}), // Select an output folder, and make a copy of the original with their metadata inserted.
						m(Button, {class:"", onclick:()=>{ }, icon:"image_data", text:Language.get_text("Modal.Export.export_metadata")}), // directly write the metadata into the original images.
					])
				])
			]
		}
	}
	
	
	Settings = {
		current_page:"General",
		is_current_page:( who )=>{
			return Modal.Settings.current_page == who ? "_selected" : "";
		},
		set_page:( who )=>{
			Modal.Settings.current_page = who;
			Modal.Settings.use_layout( Modal.Settings[who] );
		},
		
		oncreate:()=>{
			GET("ID_Settings");
			Modal.Settings.set_page(Modal.Settings.current_page);
		},
		use_layout( info ){
			m.mount(ID_Settings, info);
		},
		
		
		General:{
			view:(vnode)=>{
				return [
					m("div", {class:"_horizontal settings_item"},[
						m("span", {class:"settings_item_title"}, Language.get_text("Modal.Settings.General.language")),
						m("select", {onchange:(e)=>{ Language.change_language(e.target.value); }}, [
							Language.language_list.map(( language_id, index )=>{
								let language = Language.language_id[language_id];
								return m("option", {key:language_id, value:language_id, selected:Language.is_current_language( language_id )}, language.name);
							})
						]),
					]),
					m("div", {class:"_horizontal settings_item"},[
						m("span", {class:"settings_item_title"}, Language.get_text("Modal.Settings.General.theme")),
						m("select", {onchange:(e)=>{ App.change_theme(e.target.value); }}, [
							m("option", {value:0, selected:App.is_current_theme(0)}, Language.get_text("Modal.Settings.General.theme_option_system")),
							m("option", {value:1, selected:App.is_current_theme(1)}, Language.get_text("Modal.Settings.General.theme_option_light")),
							m("option", {value:2, selected:App.is_current_theme(2)}, Language.get_text("Modal.Settings.General.theme_option_dark")),
						]),
					]),
					// m("hr"),
					// m("div", {class:"_horizontal settings_item"},[
						// m("span", {class:"settings_item_title"}, "Tag Separator Regex"),
						// m("input", {class:"_font_mono", value:"/[\.,;。、\n；\s]*[\.,;。、\n；][\.,;。、\n；\s]*/g"}),
					// ]),
					// m("div", {class:"_horizontal settings_text"},[
						// m("div", "Warning: The above regex rule defines which symbol to be a separator indicator. Changing it will affect all existing tags in all areas."),
					// ]),
				]
			}
		},
		Help:{
			view:(vnode)=>{
				return [
					// m("div", {class:"_horizontal settings_item"},[
						// m("span", {class:"settings_item_title"}, Language.get_text("Modal.Settings.Help.open_folder")),
						// m("input", {value:"Ctrl + O", disabled:true}),
					// ]),
					m("div", {class:"_horizontal settings_item"},[
						m("span", {class:"settings_item_title"}, Language.get_text("Modal.Settings.Help.open_image")),
						m("input", {value:"Ctrl + O", disabled:true}),
					]),
					// m("div", {class:"_horizontal settings_item"},[
						// m("span", {class:"settings_item_title"}, Language.get_text("Modal.Settings.Help.open_project")),
						// m("input", {value:"Ctrl + Alt + O", disabled:true}),
					// ]),
					// m("hr"),
					// m("div", {class:"_horizontal settings_item"},[
						// m("span", {class:"settings_item_title"}, Language.get_text("Modal.Settings.Help.export_project")),
						// m("input", {value:"Ctrl + S", disabled:true}),
					// ]),
					m("div", {class:"_horizontal settings_item"},[
						m("span", {class:"settings_item_title"}, Language.get_text("Modal.Settings.Help.export_metadata")),
						m("input", {value:"Ctrl + E", disabled:true}),
					]),
					m("div", {class:"_horizontal settings_item"},[
						m("span", {class:"settings_item_title"}, Language.get_text("Modal.Settings.Help.fullscreen")),
						m("input", {value:"F11", disabled:true}),
					]),
					m("hr"),
					m("div", {class:"_horizontal settings_item"},[
						m("span", {class:"settings_item_title"}, Language.get_text("Modal.Settings.Help.tag_separator")),
						m("input", {value:';　.　,　；　。　、', disabled:true}),
					]),
					m("hr"),
					m("div", {class:"_horizontal settings_text"},[
						m("div", {class:"settings_text_small _stay-center"}, Language.get_text("Modal.Settings.Help.notice")),
					]),
				]
			}
		},
		About:{
			view:(vnode)=>{
				return [
					m("div", {class:"settings_text"},[
						m("div", {class:"_horizontal"},[
							m("div", {class:"settings_text_title"}, "Meta Tagging v0.1.1"),
							m("div", {class:"settings_text_small"}, "by hydescarf"),
						]),
						m("a", {href:"https://github.com/hydescarf/Meta-Tagging"}, "https://github.com/hydescarf/Meta-Tagging"),
						
						m("div", {class:"settings_text_desc2"}, Language.get_text("Modal.Settings.About.desc")),
					]),
					m("div", {class:"settings_text"},[
						m("div", Language.get_text("Modal.Settings.About.note_title")),
						m("div", {class:"settings_text_desc2"}, Language.get_text("Modal.Settings.About.note")),
					]),
					m("hr"),
					m("div", {class:"settings_text"},[
						m("div", Language.get_text("Modal.Settings.About.license_title")),
						m("div", {class:"settings_text_desc"}, `MIT License

Copyright (c) 2023 hydescarf

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`),
					]),
				]
			}
		},
		License:{
			view:(vnode)=>{
				return [
					m("div", {class:"settings_text"},[
						m("div", "NW.js"),
						m("div", {class:"settings_text_desc"}, `Copyright (c) 2011-2019 NW.js Authors
Copyright (c) 2011-2019 The Chromium Authors
Copyright (c) 2011-2018 Intel Corp

Permission is hereby granted, free of charge, to any person obtaining a copy of 
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to use, 
copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the 
Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR 
A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN 
ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH
THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.`),
					]),
					m("div", {class:"settings_text"},[
						m("div", "Mithril.js"),
						m("div", {class:"settings_text_desc"}, `The MIT License (MIT)

Copyright (c) 2017 Leo Horie

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`),
					]),
					m("div", {class:"settings_text"},[
						m("div", "Fluent UI System Icons"),
						m("div", {class:"settings_text_desc"}, `MIT License

Copyright (c) 2020 Microsoft Corporation

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`),
					]),
					m("div", {class:"settings_text"},[
						m("div", "exiftool-vendored"),
						m("div", {class:"settings_text_desc"}, `MIT License

Copyright (c) 2016-2023 Matthew McEachen

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`),
					]),
				]
			}
		},
		
		view:(vnode)=>{
			var _THIS = Modal.Settings;
			return [
				m("div", {class:"_horizontal no_gap"}, [
					m("div", {class:"modal_left"}, [
						m("span", {class:"modal_title"}, Language.get_text("Modal.Settings.title")),
						m("div", {class:"modal_nav"}, [
							m(Button, {class:_THIS.is_current_page("General"), onclick:()=>{ _THIS.set_page("General"); }, text:Language.get_text("Modal.Settings.General.title")}),
							m(Button, {class:_THIS.is_current_page("Help"), onclick:()=>{ _THIS.set_page("Help"); }, text:Language.get_text("Modal.Settings.Help.title")}),
							m(Button, {class:_THIS.is_current_page("About"), onclick:()=>{ _THIS.set_page("About"); }, text:Language.get_text("Modal.Settings.About.title")}),
							m(Button, {class:_THIS.is_current_page("License"), onclick:()=>{ _THIS.set_page("License"); }, text:Language.get_text("Modal.Settings.License.title")}),
						]),
					]),
					m("div", {id:"", class:"modal_right"}, [
						m("div", {class:"_horizontal settings_close_container"},[
							m(Button, {class:"_stay-right", onclick:()=>{ Modal.close(); }, icon:"close"}),
						]),
						m("div", {id:"ID_Settings", class:"modal_right_content"}, [])
					])
				])
			]
		}
	}
}
