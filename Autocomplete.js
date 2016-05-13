class Autocomplete{
	constructor(data){
		this._node;		
		this._select;
		this._input;
		this._spinner;
		this._onAutocompleteChange;
		this._onChange;
		this._pendingPromise;
		this._changed;
		
		this._init();
		
		if (!data) return;
				
		this._onAutocompleteChange	= (data.onAutocompleteChange) ? data.onAutocompleteChange : null;
		this._onChange 				= (data.onChange) ? data.onChange : null;
				
		this.setOptions(data.options, data.value); //without default options the default value has no sense, so we handle them together
	}
	
	get node(){
		return this._node;
	}	
	
	getValue(){
		return this._select.value;
	}
	
	setOptions(options, defaultValue){
		if (!options || !(options instanceof Array)) return;
			
		for (let i=this._select.children.length-1; i>-1 ; i--){
			this._select.children[i].remove();
    	}
		
		options.forEach((optionData) =>{
			var option = new Option(optionData.label, optionData.value);
			if (optionData.value === defaultValue) option.selected = true;
			this._select.appendChild(option);
		});		
		
		//during initialization stage immediate _showDropdown() method call won't expand the select element
		//(probably because the 'mousedown' event which is emulated by the method is fired before all event handlers are initialized)
		//so in order to fix this issue we're opening the select element right 'in a moment'
		setTimeout(function(){
			this._changed = false;
			this._showDropdown();
			this._updateInputValue();
		}.bind(this),1);
		
	}	
	
	_init(){
		this._createNode();			
		this._select = this.node.querySelector('select');	
		this._input = this.node.querySelector('input');	 
		this._spinner = this.node.querySelector('#spinner');
		this._showSpinner(false);
		
		this._select.onchange = (event) => {
			this._changed = true;
			this._updateInputValue();
			if (this._onChange) this._onChange(this.getValue());
		}
		
		this._select.onblur = (event) =>{
			if (this._changed) return; //in order to avoid second onChange method call after onchange event
			if (this._onChange) this._onChange(this.getValue());
		}
		
		this._input.oninput = (event) => {			
			if (!this._onAutocompleteChange) return;
			
			const result = this._onAutocompleteChange(event);	
			
			if (result instanceof Promise){
				this._pendingPromise = result; //saving the latest Promise in order to skip all previous ones
				this._showSpinner(true);
				result
					.then(function(res){
						if (result !== this._pendingPromise) return; //using closure to check if the resolved Promise is the latest one
						this._showSpinner(false);
						this.setOptions(res);
					}.bind(this))
					.catch(function(err){
						if (result !== this._pendingPromise) return; //using closure to check if the rejected Promise is the latest one
						this._showSpinner(false);
						console.error(err);
					}.bind(this));
			} else {
				this.setOpions(result);
			}
		}	
	}
	
	_showDropdown() {		
		//the only way I've found to expand the select element
    	const event = new MouseEvent('mousedown');
    	this._select.dispatchEvent(event);
	}
	
	_showSpinner(visible){		
		if (visible) this._spinner.classList.remove('hidden');
		else this._spinner.classList.add('hidden');
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