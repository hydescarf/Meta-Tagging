

var Language = new class{
	language_id = {};
	language_list = ["English", "日本語"];
	language_data = {
		English:{
			MainPane:{
				title:"Title",
				description:"Description",
				tag:"Tags",
				tag_used:"Tags used in other selected items",
				tooltip_switch_input:"Switch Tag Input Mode",
				tooltip_insert_tag:"Insert all shown tags into input area",
				tooltip_remove_tag:"Remove all shown tags from input area",
			},
			LibraryPane:{
				title:"Tag Library",
				group:"Group",
				tag:"Tags",
				new_group:"New Group",
				new_category:"New Category",
				button_switch_input:"Switch Tag Input Mode",
				button_add_category:"Add New Category",
				tooltip_rename:"Rename current group",
				tooltip_delete:"Delete current group",
				tooltip_add:"Add new group",
				tooltip_insert_tag:"Insert all shown tags into input area",
				tooltip_remove_tag:"Remove all shown tags from input area",
			},
			Item:{
				item_title:"Tt",
				item_desc:"Ds",
			},
			MenuBar:{
				open:"Open",
				export:"Export",
				settings:"Settings",
			},
			Dialogue:{
				Delete:{
					question:"Are you sure you want to remove the following item?",
					item_name_group:"Group",
					item_name_category:"Category",
					item_name_item:"Image",
					item_name_item_multiple:"Multiple Selected Image",
					desc:"All data within it will be removed and cannot be undone.",
					button_delete:"Delete",
					button_cancel:"Cancel",
				},
				Export:{
					question:"The system will begin to write the metadata into selected original images.",
					desc:"Please press the confirm button when you are ready to proceed.",
					button_confirm:"Confirm",
					button_cancel:"Cancel",
				},
				Loading:{
					text:"Loading...",
					text2:"Loading Complete.",
					skip_format:"file(s) skipped for unsupported extension.",
					skip_dupe:"file(s) skipped for being duplicated.",
					button_confirm:"Confirm",
				},
				Exporting:{
					text:"Exporting...",
					text2:"Export Complete.",
					file_not_found:"File not found:",
					button_confirm:"Confirm",
				},
			},
			Modal:{
				Open:{
					title:"Open",
					open_folder:"Open as Folder",
					open_image:"Open as Images",
					open_project:"Open as Project",
				},
				Export:{
					title:"Export",
					export_project:"Export Current Project",
					export_metadata:"Export Metadata into Images",
				},
				Settings:{
					title:"Settings",
					General:{
						title:"General",
						language:"Language",
						theme:"Theme",
						theme_option_system:"System Default",
						theme_option_light:"Light",
						theme_option_dark:"Dark",
					},
					Help:{
						title:"Help",
						open_folder:"Open (Folder)",
						// open_image:"Open (Images)",
						open_image:"Open",
						open_project:"Open (Project)",
						export_project:"Export (Project)",
						// export_metadata:"Export (Metadata)",
						export_metadata:"Export",
						fullscreen:"Toggle Fullscreen",
						tag_separator:"Tag Input Separator Mark",
						notice:"*All editings are temporarily not available.",
					},
					About:{
						title:"About",
						desc:`A software built for editing and managing the metadata of image, specially for the purpose of stock photo/illustration.
							
	Currently only support "Title", "Description", and "Tag/Keyword" metadata, enough for managing tags for stock photo purpose.

	Currently only support format "JPEG", and metadata "XMP", "EXIF", and "IPTC".
							`,
						note_title:"Note:",
						note:`As it is an app built for personal use, there is no priority on other improvement other than basic functionality.

	Request or Bug Report can be made via github repository (link above), however, there's no guarantee it will made through the update.

	Please treat it as a beta product, thank you.
							`,
						license_title:"License:",
					},
					License:{
						title:"License",
					},
				},
			}
		},
		日本語:{
			MainPane:{
				title:"タイトル",
				description:"コメント",
				tag:"タグ",
				tag_used:"ほかの画像に使用されたタグ",
				tooltip_switch_input:"タグの入力方式を変更",
				tooltip_insert_tag:"表示されたタグをすべて挿入",
				tooltip_remove_tag:"表示されたタグをすべて外す",
			},
			LibraryPane:{
				title:"タグ倉庫",
				group:"グループ",
				tag:"タグ",
				new_group:"新規グループ",
				new_category:"新規カテゴリー",
				button_switch_input:"タグの入力方式を変更",
				button_add_category:"新規カテゴリーを作成",
				tooltip_rename:"現在のグループを改名",
				tooltip_delete:"現在のグループを削除",
				tooltip_add:"新規グループを作成",
				tooltip_insert_tag:"表示されたタグをすべて挿入",
				tooltip_remove_tag:"表示されたタグをすべて外す",
			},
			Item:{
				item_title:"題",
				item_desc:"概",
			},
			MenuBar:{
				open:"開く",
				export:"書き出す",
				settings:"設定",
			},
			Dialogue:{
				Delete:{
					question:"本当に以下のものを削除してもよろしいでしょうか？",
					item_name_group:"グループ",
					item_name_category:"カテゴリー",
					item_name_item:"画像",
					item_name_item_multiple:"複数選択した画像",
					desc:"その中にあるデータはすべて削除し、元に戻せないことになります。",
					button_delete:"削除",
					button_cancel:"キャンセル",
				},
				Export:{
					question:"これからはご指定のすべてのオリジナル画像にメタデータを書き込みます。",
					desc:"準備ができたら実行開始ボタンを押してください。",
					button_confirm:"実行開始",
					button_cancel:"キャンセル",
				},
				Loading:{
					text:"読み込み中・・・",
					text2:"読み込み完了。",
					skip_format:"個のファイルがフォーマットが対応されていないためスキップされました。",
					skip_dupe:"個のファイルがすでに読み込んでいるためスキップされました。",
					button_confirm:"閉じる",
				},
				Exporting:{
					text:"書き込み中・・・",
					text2:"書き込む完了。",
					file_not_found:"ファイルが見つかりません：",
					button_confirm:"閉じる",
				},
			},
			Modal:{
				Open:{
					title:"開く",
					open_folder:"フォルダーを開く",
					open_image:"画像を開く",
					open_project:"プロジェクトを開く",
				},
				Export:{
					title:"書き出す",
					export_project:"プロジェクトを書き出す",
					export_metadata:"画像にメタデータを書き込む",
				},
				Settings:{
					title:"設定",
					General:{
						title:"一般",
						language:"言語",
						theme:"テーマ",
						theme_option_system:"システムテーマ",
						theme_option_light:"ライト",
						theme_option_dark:"ダーク",
					},
					Help:{
						title:"ヘルプ",
						open_folder:"開く（フォルダー）",
						// open_image:"開く（画像）",
						open_image:"開く",
						open_project:"開く（プロジェクト）",
						export_project:"書き出す（プロジェクト）",
						// export_metadata:"書き出す（メタデータ）",
						export_metadata:"書き出す",
						fullscreen:"フルスクリーントグル",
						tag_separator:"タグ入力時に分別する記号",
						notice:"※ここの項目は現時点では編集はできません。",
					},
					About:{
						title:"アプリについて",
						desc:`このソフトはストックフォト・ストックイラストのための画像の情報を編集するのに作られたメタデータの管理アプリです。
						
		現時点では、「タイトル」「コメント・キャプション」「タグ・キーワード」の三つの項目しか編集できませんが、ストックフォトに使うには十分でしょう。

		現在サポートしているフォーマットは「JPEG」のみと、「XMP」「EXIF」「IPTC」の三つの情報のみです。`,
						note_title:"備考：",
						note:`個人のための開発であるため、基本的な機能の方にのみ優先します。
						
		要望やバグ報告はGithub（上のリンク）にて提出できますが、速やかな対応や実装などはお約束できかねますのでご了承ください。

		なお、本ソフトをベータ版製品として扱っていただければ幸いです。`,
						license_title:"ライセンス：",
					},
					License:{
						title:"ライセンス",
					},
				},
			}
		}
	};
	current_language_id = "English";
	
	create_language(){
		for( let i = 0; i < this.language_list.length; i++ ){
			let id = this.language_list[i];
			let data = {
				id:this.language_list[i],
				name:this.language_list[i],
				data:this.language_data[this.language_list[i]] //is this safe?
			};
			this.language_id[id] = data;
		}
	}
	
	get_text( type ){
		return type.split('.').reduce((p,c)=>p&&p[c]||null, this.language_id[this.current_language_id].data);
	}
	is_current_language( id ){
		return id == this.current_language_id;
	}
	change_language( id ){
		this.current_language_id = id;
		SaveLoad.save_other();
	}
}

Language.create_language();