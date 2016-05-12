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
		
	/*	let defaultOption = new Option(this._input.value);
		defaultOption.selected = true;
		defaultOption.disabled = true;
		this._select.appendChild(defaultOption);*/
		
		options.forEach((optionData) =>{
			var option = new Option(optionData.label, optionData.value);
			option.selected = false;
			option.onkeydown = () => {alert("focus")}
			this._select.appendChild(option);
		});		
		
		this._showDropdown();
		
		var option = this._select.querySelector('option');
		option.onfocus = function (){console.log("option")}
	}
	
	getValue(){
		return this._select.value;
	}
	
	_init(){
		this._createNode();			
		this._select = this.node.querySelector('select');	
		this._input = this.node.querySelector('input');	 
		
		//this._select.onclick = () => {console.log("clock")}
		
		this._select.onchange = (event) => {
		//	console.log("input")
		//	console.log(this._select.selectedIndex)
			this._input.value = this._select.options[this._select.selectedIndex].label;
			if (this._onChange) this._onChange(this.getValue());
		}
	}
	
	_showDropdown() {		
    	const event = new MouseEvent('mousedown');
    	this._select.dispatchEvent(event);
	}
	
	_createNode(){		
		this._node = document.createElement('div');
		this._node.innerHTML = 
			`<form>
				<select>
				</select>
				<input type="text"/>				
			</form>`;	
	}
}