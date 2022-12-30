module.exports = `body {
  margin: 0;
  overflow: hidden;
  background: #0e0e0e;
}

.moloko-editor {
  display: block;
  width: 100%;
  height: 100%;
  -webkit-font-smoothing: antialiased;
}

#editor {
  position: absolute;
  top: 1px;
  right: 0;
  bottom: 30px;
  left: 0;
  margin: 0;
  text-size-adjust: 100%;
}

.select-sample {
  right: 50%;
  width: 250px;
  height: 250px;
}
.select-sample.open {
  transform: translateY(250px);
  transition: transform 0.2s linear;
}
.select-sample.close {
  transform: translateY(0);
  transition: transform 0.2s linear;
}

.select-language {
  left: 0;
  width: 200px;
  height: 200px;
}
.select-language.open {
  transform: translateY(200px);
  transition: transform 0.2s linear;
}
.select-language.close {
  transform: translateY(0);
  transition: transform 0.2s linear;
}

.select-sample,
.select-language {
  position: absolute;
  bottom: 0;
  z-index: 9999;
  display: block;
  align-items: center;
  padding: 0;
  overflow-x: hidden;
  overflow-y: scroll;
  font-size: 0.785rem;
  font-family: Arial, Helvetica, sans-serif;
  background: #0e0e0e;
  border-top: 0.01rem solid #444;
  border-right: 0.01rem solid #444;
  border-left: 0.01rem solid #444;
  will-change: auto;
}
.select-sample ul,
.select-language ul {
  display: block;
  margin: 0 0 45px;
  padding: 0 20px;
  list-style-type: none;
}
.select-sample ul .language,
.select-language ul .language {
  display: flex;
  width: 100%;
  margin-top: 20px;
  color: #666;
}
.select-sample ul .language.selected,
.select-language ul .language.selected {
  color: #fff;
  font-weight: 600;
  cursor: not-allowed;
}
.select-sample ul .language:hover,
.select-language ul .language:hover {
  color: #fff;
  cursor: pointer;
}
.select-sample ul .language > svg,
.select-language ul .language > svg {
  width: 17px;
  height: 17px;
}
.select-sample ul .language span,
.select-language ul .language span {
  margin-left: 8px;
}

.newfile_overlay {
  position: absolute;
  top: 41px;
  right: 0;
  bottom: 30px;
  left: 0;
  z-index: 9999;
  width: 100%;
  height: 100%;
  padding: 25px;
  background: #0e0e0e;
}
.newfile_overlay > p {
  color: #fff;
  font-weight: lighter;
  font-size: 0.895rem;
  font-size: 0.8rem;
  font-family: Monaco, Menlo, "Ubuntu Mono", Consolas, source-code-pro, monospace;
  font-style: italic;
  font-style: oblique;
  text-align: left;
  -webkit-font-smoothing: antialiased;
}

.potion_footer {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 9999;
  width: 100%;
  height: 30px;
  color: #fff;
  font-size: 0.785rem;
  font-family: Arial, Helvetica, sans-serif;
  line-height: 30px;
  background: #0e0e0e;
  border-top: 0.01rem solid #666;
  -webkit-font-smoothing: antialiased;
}
.potion_footer footer {
  position: relative;
}
.potion_footer footer > ul {
  margin: 0;
  padding: 0 20px 0 15px;
  list-style-type: none;
}
.potion_footer footer > ul > li {
  display: inline-block;
}
.potion_footer footer > ul > li.language-auto.active > svg {
  color: #7be66d;
}
.potion_footer footer > ul > li.language-auto > svg {
  width: 14px;
  height: 14px;
  color: #666;
}
.potion_footer footer > ul > li.language-auto span.hover-above {
  position: absolute;
  bottom: 35px;
  left: -10px;
  z-index: 8888;
  display: none;
  color: #666;
  font-size: 11px;
  background-color: #0e0e0e;
}
.potion_footer footer > ul > li.language-auto:hover span.hover-above {
  display: block;
}
.potion_footer footer > ul > li.language {
  padding-left: 8px;
}
.potion_footer footer > ul > li.language-auto, .potion_footer footer > ul > li.language {
  padding-right: 20px;
  cursor: pointer;
}
.potion_footer footer > ul > li.language-auto > svg, .potion_footer footer > ul > li.language > svg {
  position: absolute;
  top: 8px;
  width: 14px;
  height: 14px;
}
.potion_footer footer > ul > li.language-auto span, .potion_footer footer > ul > li.language span {
  margin-left: 25px;
}
.potion_footer footer > ul > li.language-auto:hover span.hover, .potion_footer footer > ul > li.language:hover span.hover {
  display: inline-block;
}
.potion_footer footer > ul > li.language-auto span.hover, .potion_footer footer > ul > li.language span.hover {
  display: none;
  margin-left: 10px;
  color: #666;
  font-size: 11px;
}
.potion_footer footer > ul > li.reload-sample {
  float: right;
  font-size: 11px;
  cursor: pointer;
}
.potion_footer footer > ul > li.reload-sample span.hover {
  display: none;
  padding-right: 10px;
  color: #666;
}
.potion_footer footer > ul > li.reload-sample:hover {
  color: #fff;
}
.potion_footer footer > ul > li.reload-sample:hover span.hover {
  display: inline-block;
}
.potion_footer footer > ul > li.reload-sample > svg {
  position: absolute;
  top: 8px;
  width: 14px;
  height: 14px;
  color: inherit;
}
.potion_footer footer > ul > li.samples {
  float: right;
  padding-right: 14px;
  padding-left: 14px;
  color: #999;
  font-size: 11px;
  cursor: pointer;
}
.potion_footer footer > ul > li.samples span {
  padding-left: 14px;
}
.potion_footer footer > ul > li.samples span.hover {
  display: none;
  color: #666;
}
.potion_footer footer > ul > li.samples:hover {
  color: #fff;
}
.potion_footer footer > ul > li.samples:hover svg {
  color: #fff;
}
.potion_footer footer > ul > li.samples:hover span.hover {
  display: inline-block;
}
.potion_footer footer > ul > li.samples > svg {
  position: absolute;
  top: 7px;
  right: 10px;
  width: 16px;
  height: 16px;
  color: #999;
}
.potion_footer footer > ul > li.prettify {
  float: right;
  padding-left: 20px;
}
.potion_footer footer > ul > li.file-size {
  float: right;
}
.potion_footer footer > ul > li.chars {
  float: right;
  padding-right: 20px;
}
.potion_footer footer > ul > li.github {
  position: absolute;
  top: 5px;
  right: 30px;
  float: right;
  padding-left: 20px;
}
.potion_footer footer > ul > li.github > svg {
  width: 17px;
  height: 17px;
}

.potion_nav {
  position: relative;
}

.potion_settings {
  position: fixed;
  top: 39px;
  right: 0;
  bottom: 0;
  z-index: 9999;
  display: block;
  width: 270px;
  background: #0e0e0e;
  border-left: 0.01rem solid #666;
  will-change: auto;
}
.potion_settings.open {
  transform: translateX(0);
  transition: transform 0.2s linear;
}
.potion_settings.close {
  transform: translateX(270px);
  transition: transform 0.2s linear;
}

.potion_tabs {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  width: 100%;
  height: 39.5px;
  color: #fff;
  background: #0e0e0e;
  border-bottom: 0.01rem solid #666;
}
.potion_tabs > ul {
  margin: 0;
  padding: 0;
  list-style-type: none;
}
.potion_tabs > ul > li {
  display: inline-block;
}
.potion_tabs .btn_split,
.potion_tabs .btn_settings {
  position: absolute;
  top: 2px;
  right: 15px;
  height: 39.5px;
  color: #666;
  background: transparent;
  border: 0;
}
.potion_tabs .btn_split:hover,
.potion_tabs .btn_settings:hover {
  color: #fff;
  cursor: pointer;
}
.potion_tabs .btn_split > svg,
.potion_tabs .btn_settings > svg {
  width: 20px;
  height: 20px;
}
.potion_tabs .btn_split {
  right: 155px;
}
.potion_tabs .btn_ghissue {
  position: absolute;
  top: 0;
  right: 20px;
  height: 39.5px;
  padding-left: 17px;
  color: #666;
  font-size: 0.725rem;
  background: transparent;
  border: 0;
  border-left: 0.01rem solid #666;
}
.potion_tabs .btn_ghissue:hover {
  color: #f8f8f8;
  cursor: pointer;
}
.potion_tabs .btn_ghissue > svg {
  position: absolute;
  top: 10px;
  width: 17px;
  height: 17px;
}
.potion_tabs .btn_ghissue > span {
  padding-left: 25px;
  -webkit-font-smoothing: antialiased;
}
.potion_tabs .tab_item {
  position: relative;
  display: block;
  height: 40px;
  padding: 0 30px 0 20px;
  color: #666;
  font-size: 13px;
  font-family: Arial, Helvetica, sans-serif;
  line-height: 40px;
  text-align: center;
  background: transparent;
  border: 0;
  border-right: 0.01rem solid #666;
}
.potion_tabs .tab_item .delete {
  z-index: 99999;
  display: none;
}
.potion_tabs .tab_item .delete:hover > svg {
  color: #fff;
}
.potion_tabs .tab_item .delete > svg {
  position: absolute;
  top: 13px;
  right: 8px;
  width: 14px;
  height: 14px;
  color: #4a4343;
}
.potion_tabs .tab_item.active {
  height: 41px;
  color: #fff;
  background: #0e0e0e;
}
.potion_tabs .tab_item.active .delete {
  display: block;
}
.potion_tabs .tab_item > input {
  width: auto;
  height: 20px;
  color: #fff;
  text-align: left;
  background: transparent;
  border: 0;
  outline: none;
}
.potion_tabs .tab_item.new {
  border-right: none;
}
.potion_tabs .tab_item.add {
  position: relative;
  width: 20px;
  padding: 0;
  border-right: none;
}
.potion_tabs .tab_item.add > svg {
  position: absolute;
  top: 5px;
  width: 20px;
  height: 20px;
}
.potion_tabs .tab_item:hover {
  color: #fff;
  cursor: pointer;
}
.potion_tabs .tab_item:hover .delete {
  display: block;
}

.ace_folding-enabled > .ace_gutter-cell {
  color: #444;
}

.ace-potion {
  color: #f8f8f2;
  white-space: pre-wrap;
  text-shadow: none;
  background-color: #0e0e0e;
  -webkit-font-smoothing: antialiased;
}
.ace-potion .ace_gutter {
  color: #fff;
  background: #0e0e0e;
}
.ace-potion .ace_print-margin {
  width: 0.01rem;
  background: rgba(255, 255, 255, 0.0823529412);
}
.ace-potion .ace_cursor {
  border-left: 1px solid #f8f8f0 !important;
}
.ace-potion .ace_marker-layer .ace_selection {
  background: rgba(255, 255, 255, 0.0823529412);
}
.ace-potion.ace_multiselect .ace_selection.ace_start {
  box-shadow: 0 0 3px 0 #272822;
}
.ace-potion .ace_marker-layer .ace_step {
  background: rgb(102, 82, 0);
}
.ace-potion .ace_marker-layer .ace_bracket {
  margin: -1px 0 0 -1px;
  border: 1px solid rgba(255, 255, 255, 0.0823529412);
}
.ace-potion .ace_marker-layer .ace_active-line {
  background: rgba(255, 255, 255, 0.0823529412);
}
.ace-potion .ace_gutter-active-line {
  color: #fff;
  background-color: #0e0e0e;
}
.ace-potion .ace_marker-layer .ace_selected-word {
  border: 1px solid rgba(255, 255, 255, 0.0823529412);
}
.ace-potion .ace_invisible {
  color: #454545;
}
.ace-potion .ace_invisible.ace_invisible_eol {
  display: none;
}
.ace-potion .ace_meta.ace_tag.ace_punctuation.ace_ouput-open.ace_liquid,
.ace-potion .ace_punctuation.ace_close.ace_output.ace_liquid {
  color: #9ba0a1;
}
.ace-potion .ace_meta.ace_tag.ace_tag-name.ace_xml {
  color: #ff93bc;
}
.ace-potion .ace_meta.ace_tag.ace_punctuation.ace_tag-open.ace_xml, .ace-potion .ace_meta.ace_tag.ace_punctuation.ace_end-tag-open.ace_xml, .ace-potion .ace_meta.ace_tag.ace_punctuation.ace_tag-close.ace_xml {
  color: #becaff;
}
.ace-potion .ace_keyword.ace_operator.ace_attribute-equals.ace_xml {
  color: #ff93bc;
}
.ace-potion .ace_entity.ace_name.ace_function {
  color: #9ee34f;
}
.ace-potion .ace_entity.ace_other {
  color: #9ee34f;
}
.ace-potion .ace_entity.ace_other.ace_attribute-name {
  color: #9ee34f;
}
.ace-potion .ace_entity.ace_other.ace_attribute-name.ace_xml {
  color: #91ebc2;
}
.ace-potion .ace_entity.ace_name.ace_tag {
  color: #fc2172;
}
.ace-potion .ace_keyword,
.ace-potion .ace_meta.ace_tag,
.ace-potion .ace_storage {
  color: #fc2172;
}
.ace-potion .ace_punctuation {
  color: #fff;
}
.ace-potion .ace_punctuation.ace_tag {
  color: #fff;
}
.ace-potion .ace_constant {
  color: #fc2172;
}
.ace-potion .ace_constant.ace_character, .ace-potion .ace_constant.ace_language, .ace-potion .ace_constant.ace_numeric, .ace-potion .ace_constant.ace_other {
  color: #ae81ff;
}
.ace-potion .ace_invalid {
  color: #f8f8f0;
  background-color: #fc2172;
}
.ace-potion .ace_invalid.ace_deprecated {
  color: #f8f8f0;
  background-color: #ae81ff;
}
.ace-potion .ace_support.ace_class, .ace-potion .ace_support.ace_type {
  color: #66d9ef;
}
.ace-potion .ace_support.ace_constant, .ace-potion .ace_support.ace_function {
  color: #66d9ef;
}
.ace-potion .ace_fold {
  background-color: #9ee34f;
  border-color: #f8f8f2;
}
.ace-potion .ace_storage.ace_type {
  color: #66d9ef;
}
.ace-potion .ace_storage.ace_type + .ace_identifier {
  color: #fff;
}
.ace-potion .ace_variable.ace_language {
  color: #ffab40;
}
.ace-potion .ace_keyword + .ace_punctuation.ace_operator {
  color: #888;
}
.ace-potion .ace_punctuation.ace_operator {
  color: #888;
}
.ace-potion .ace_punctuation.ace_operator + .ace_identifier {
  color: #fff;
}
.ace-potion .ace_paren.ace_lparen, .ace-potion .ace_paren.ace_rparen {
  color: #888;
}
.ace-potion .ace_variable {
  color: #9ee34f;
}
.ace-potion .ace_variable.ace_parameter {
  color: #ffab40;
  font-style: italic;
}
.ace-potion .ace_string {
  color: #fff78c;
}
.ace-potion .ace_comment {
  color: #888;
}
.ace-potion .ace_indent-guide {
  position: relative;
  z-index: 99999;
  display: inline-block;
  border-right: 0.01rem solid #3f3f3f;
}`;