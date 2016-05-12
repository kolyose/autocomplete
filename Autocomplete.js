class Autocomplete{
	constructor(data){
		this._node;		
		this._select;
		this._input;
		this._value;
		this._onAutocompleteChange;
		this._onChange;
		
		this._init();
		
		if (!data) return;
		
		this._value 				= (data.value) ? data.value : null;
		this._onAutocompleteChange	= (data.onAutocompleteChange) ? data.onAutocompleteChange : null;
		this._onChange 				= (data.onChange) ? data.onChange : null;
		
		this.setOptions(data.options);
	}
	
	get node(){
		return this._node;
	}	
	
	setOptions(options){
		if (!options || !(options instanceof Array)) return;
			
		for (let i=this._select.children.length-1; i>-1 ; i--){
			this._select.children[i].remove();
    	}
		
		options.forEach((optionData) =>{
			var option = new Option(optionData.label, optionData.value);
			this._select.appendChild(option);
		});		
		
		this._showDropdown();		
		this._updateInputValue();
	}
	
	getValue(){
		return this._select.value;
	}
	
	_init(){
		this._createNode();			
		this._select = this.node.querySelector('select');	
		this._input = this.node.querySelector('input');	 
		
		this._select.onchange = (event) => {
			this._updateInputValue();
			if (this._onChange) this._onChange(this.getValue());
		}
	
	}
	
	_showDropdown() {		
    	const event = new MouseEvent('mousedown');
    	this._select.dispatchEvent(event);
	}
	
	_updateInputValue(){
		this._input.value = this._select.options[this._select.selectedIndex].label;
	}
	
	_createNode(){		
		this._node = document.createElement('div');
		this._node.innerHTML = 
			`<form>
				<select>
				</select>
				<input type="text"/>				
 				<div id="spinner"></div>
			</form>`;	
	}
}