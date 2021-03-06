import React from "react";
import $ from "jquery";
import NewsList from "./NewsList.jsx!";
import FeedManager from "./FeedManager.jsx!";

export default React.createClass({

	getInitialState(){
		return {siteUrls: []};
	},

	fetchSites(){
		fetch("/sites")
			.then(response => response.json())
			.then(data => this.addItemToState(data))
			.catch(e => console.log("err"))
	},

	componentWillMount(){
		this.fetchSites();
	},

	addItemToState(item){

		/* 
			NOTE THE ROOT ELEMENT JUST OWNS THE SITEURLS
			IT'S CHILD... 'NEWSLIST' (COMPONENT) OWNS THE *ACTUAL* NEWSITEM METADATA 
		*/

		// because the state always should be treated as immutible
		// i can only ever call setState and hence need to dupe the current vals
		let dupe = this.state.siteUrls;

			// thank you es2015!
			dupe.push.apply(dupe, item);

		// single source of truth!!
		this.setState({siteUrls: dupe});

	},

	onFormSubmit(data){
		$.ajax({
			type: "POST",
			url: "/sites",
			data: data,
			success(res){
				return res;
			}
		}).then((returnedId) => {
			data._id = returnedId;
			this.addItemToState([data]);
		})
	},
	
	render(){
		
		return (
			<div className="feed-app-root">
				<FeedManager siteUrls={this.state.siteUrls} onFormSubmit={this.onFormSubmit}/>
				<NewsList siteUrls={this.state.siteUrls} />
				<div className="notifications-container"></div>
			</div>
		)
	}

});