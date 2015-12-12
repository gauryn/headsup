var category = {

	categoryCollection: [
	{'name': 'disney', 'cards':['mickey mouse', 'little mermaid', 'strawberry shortcake']},
	{'name':'fruits', 'cards':['apple', 'orange', 'mango']}
	],

	add: function(name, cards){
		this.categoryCollection.push({name: name, cards:cards});
		return this.categoryCollection[this.categoryCollection.length - 1];
	},

	get: function(name){
		if(name==undefined) return this.categoryCollection;
		else{
			for(var i=0; i<this.categoryCollection.length; i++){
			if(this.categoryCollection[i].name == name){
					return this.categoryCollection[i];
				}
			}
		}
	}
}

module.exports = category;