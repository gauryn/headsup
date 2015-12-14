var category = {

	//categories and titles - there are 2 categories: disney & fruits
	categoryCollection: [
	{'name': 'disney', 'cards':['mickey mouse', 'little mermaid', 'strawberry shortcake']},
	{'name':'fruits', 'cards':['apple', 'orange', 'mango']}
	],

	//add new Category - object with category name & cards
	add: function(name, cards){
		this.categoryCollection.push({name: name, cards:cards});
		return this.categoryCollection[this.categoryCollection.length - 1];
	},

	get: function(name){
		//get all categories if none specified
		if(name==undefined) return this.categoryCollection;
		//get specific cateogry
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