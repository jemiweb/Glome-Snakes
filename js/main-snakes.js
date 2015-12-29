// let's check localstorage if there is a GlomeID set
// if not => let's create one
if( !localStorage.getItem('GlomeID') ) {
	
	// Using the core $.ajax() method
	$.ajax({
	 
	    // The URL for the request
	    url: "https://api.glome.me/accounts/create",
	 
	    // The data to send (will be converted to a query string)
	    data: {
	      apikey: "e0e654812d11223d009f0191e2fb89ef",
				apiuid: "get.glome.me"
	    },
	
	    // Whether this is a POST or GET request
	    type: "POST",
	 
	    // The type of data we expect back
	    dataType : "json",
	 
	    // Code to run if the request succeeds;
	    // the response is passed to the function
	    success: function( json ) {
	        
	        // json is an array/object and we only get one
	        // we can push it to html
	        $( "#title" ).html( json.parentapp_title ).append();
	        
	        // let's collect all JSON items to a Sting
	        var items = loopThrough ( json, items );
					
					$( "#content" ).html( items );        
	        
	        localStorage.setItem('GlomeID', json.glomeid );
	        
	    },
	 
	    // Code to run if the request fails; the raw request and
	    // status codes are passed to the function
	    error: function( xhr, status, errorThrown ) {
	    		var txt = "Problem creating SoftAccount!";
	    		txt += "<br><br> xhr: <pre>" + JSON.stringify(xhr, null, 2) + "</pre>";
	    		
	        
	        $( "#status" ).html( txt );
	    },
			
			/*
	    // Code to run regardless of success or failure
	    complete: function( xhr, status ) {
	        // alert( "The request is complete!" );
	        $( "#status" ).html( "The request is complete!" );
	    }
	    */
	});	
	
	
}
// we have a GlomeID - let's unlock it just to be sure
// a soft account unlocks itself automatically after 1 day
else {
	
	// just to keep the code readable...
	var GlomeID = localStorage.getItem('GlomeID');
	
	// Using the core $.ajax() method
	$.ajax({
	 
	    /***			
			curl https://api.glome.me/accounts/{glomeid}/unlock -X
			PATCH -d
			apikey={apikey} -d
			apiuid={uid} -i -l
			
			*/
	    
	    // The URL for the request
	    url: "https://api.glome.me/accounts/"+GlomeID+"/unlock",
	 
	    // The data to send (will be converted to a query string)
	    data: {
	      apikey: "e0e654812d11223d009f0191e2fb89ef",
				apiuid: "get.glome.me"
	    },
	
	    // Whether this is a POST or GET request
	    type: "PUT",
	 
	    // The type of data we expect back
	    dataType : "json",
	 
	    // Code to run if the request succeeds;
	    // the response is passed to the function
	    success: function( json ) {
	        
	        // unlocked

	    },
	 
	    // Code to run if the request fails; the raw request and
	    // status codes are passed to the function
	    error: function( xhr, status, errorThrown ) {
	    		var txt = "Problem unlocking the Soft Account!";
	    		txt += "<br><br> xhr: <pre>" + JSON.stringify(xhr, null, 2) + "</pre>";
	        
	        $( "#status" ).html( txt );
	    }
	    
	// end of unlocking
	});
	
	
	// if pairing is requested, let's pair
	if ( getParameterByName('pairingkey') != "" ) {
		console.log("pairing key found, let's pair");
		pairSoftAccounts ( getParameterByName('pairingkey') );
		console.log("pairing done");
	}
	
}

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

/***
loopThrough just to print the contents of json nicely
as html

@param json - the json
@patam txt - the string to which add the html

*/
function loopThrough ( obj, txt ) {

	txt += JSON.stringify(obj, null, 2);

	return txt;
}

/***
getSoftAccountInfo - List info about the Soft Account

curl https://api.glome.me/users/{glomeid}/show -X
GET -d
application[apikey]={apikey} -d
application[uid]={uid} -i -l

*/
function getSoftAccountInfo () {
	
	// just to keep the code readable...
	var GlomeID = localStorage.getItem('GlomeID');
	
	// put the GlomeID into the content element of the page
	// $('#content').html( GlomeID );

/**** query 1

Here we query the GlomeID for contents

*****/

	// Using the core $.ajax() method
	$.ajax({
	 
	    // The URL for the request
	    url: "https://api.glome.me/accounts/"+GlomeID+"/show",
	 
	    // The data to send (will be converted to a query string)
	    data: {
	      apikey: "e0e654812d11223d009f0191e2fb89ef",
				apiuid: "get.glome.me"
	    },
	
	    // Whether this is a POST or GET request
	    type: "GET",
	 
	    // The type of data we expect back
	    dataType : "json",
	 
	    // Code to run if the request succeeds;
	    // the response is passed to the function
	    success: function( json ) {
	        
	        // we can push it to html
	        $( "#title" ).html( "GlomeID info" );
	        
	        // let's collect all JSON items to a Sting
	        var items = "";
	        items = loopThrough ( json, items );
					
					// now we put the collected info to the html
					$( "#content" ).html( "<pre>"+ items +"</pre>" );        
	        
	    },
	 
	    // Code to run if the request fails; the raw request and
	    // status codes are passed to the function
	    error: function( xhr, status, errorThrown ) {
	    		var txt = "Problem getting info about SoftAccount!";
	    		txt += "<br><br> xhr: <pre>" + JSON.stringify(xhr, null, 2) + "</pre>";
	        
	        $( "#status" ).html( txt );
	    }
	    
	// end of Query GlomeID for info
	});

}	


/***
listData - Let's list the data this user has stored.

curl https://api.glome.me/data/{glomeid}/list -X
GET -d
per_page=20 -d
page=2 -d
application[apikey]={apikey} -d
application[uid]={uid} -i -l

*/
function listData ( update ) {
	
	var GlomeID = localStorage.getItem('GlomeID');

	// set info to GlomeID
	// Using the core $.ajax() method
	$.ajax({
	    
	    // The URL for the request
	    // here we use the GlomeID to get the right user data
	    url: "https://api.glome.me/data/"+GlomeID+"/list",
	 
	    // The data to send (will be converted to a query string)
	    data: {
	      apikey: "e0e654812d11223d009f0191e2fb89ef",
				apiuid: "get.glome.me",
				per_page: 1
	    },
	
	    // Whether this is a POST or GET request
	    type: "GET",
	 
	    // The type of data we expect back
	    dataType : "json",
	 
	    // Code to run if the request succeeds;
	    // the response is passed to the function
	    success: function( json ) {
	        
	        // json is an array/object and we only get one
	        // we can push it to html
	        $( "#title" ).html( "Listing data from user" );
	        
	        // let's collect all JSON items to a Sting
	        var items = "";
	        
	        // looping through the records
	        // the last one is always on top
	        items = loopThrough ( json, items );
					
					$( "#content" ).html( "<pre>"+ items +"</pre>" );

					dataset = json["records"][0]["content"];	
					console.log("List data on server:"+ dataset );
					
					// updating the game with last save
					if ( update ) {
						snake_array = dataset[0];
						food = dataset[1];
						score = dataset[2];
						d = dataset[3];
					} 
					       
	    },
	 
	    // Code to run if the request fails; the raw request and
	    // status codes are passed to the function
	    error: function( xhr, status, errorThrown ) {
	    		var txt = "Problem listing data!";
	    		txt += "<br><br> xhr: <pre>" + JSON.stringify(xhr, null, 2) + "</pre>";
	    		
	        $( "#status" ).html( txt );
	    }
	    
	// end of listing data
	});

}


/***

getSyncKEy - get a sync key to pair soft accounts together

curl https://api.glome.me/connections/{glomeid}/initialize -X
POST -d
application[apikey]={apikey} -d 
application[uid]={uid}

*/
function getSyncKey ( ) {
	
	// set info to GlomeID
	// Using the core $.ajax() method
	$.ajax({
	
	    // The URL for the request
	    // here we use the GlomeID to get the right user data
	    url: "https://api.glome.me/connections/"+localStorage.getItem('GlomeID')+"/initialize",
	 
	    // The data to send (will be converted to a query string)
	    data: {
	      apikey: "e0e654812d11223d009f0191e2fb89ef",
				apiuid: "get.glome.me"
	    },
	
	    // Whether this is a POST or GET request
	    type: "POST",
	 
	    // The type of data we expect back
	    dataType : "json",
	 
	    // Code to run if the request succeeds;
	    // the response is passed to the function
	    success: function( json ) {
	        
	        // json is an array/object and we only get one
	        // we can push it to html
	        $( "#title" ).html( "Sync key generated" );
					
					// let's collect all JSON items to a Sting
	        var items = "";
	        
	        // looping through the records
	        items = loopThrough ( json, items );
					
					//$( "#content" ).html( "<pre>"+ items +"</pre>" );
					
					// opening up the mail
					var url = "mailto:user@example.com?subject=Send link to self";
					url += "&body=";
					url += "Hi. Follow the simple steps:%0D%0A";
					url += "1. send this mail to yourself or copy the code below %0D%0A";
					url += "2. open the site: "+window.location.href+" %0D%0A";
					url += "3. paste the code to the 'set pairing key' field %0D%0A%0D%0A";
					url += "LINK: "+window.location.href+"?pairingkey="+json.code;
					url += "%0D%0ACODE: "+json.code;
					
					window.location = url;
	        
	    },
	 
	    // Code to run if the request fails; the raw request and
	    // status codes are passed to the function
	    error: function( xhr, status, errorThrown ) {
	    		var txt = "Problem with the SyncKey!";
	    		txt += "<br><br> xhr: <pre>" + JSON.stringify(xhr, null, 2) + "</pre>";
	    		
	        $( "#content" ).html( txt );
	    }
	    
	// end of set User data
	});
	
}


/***

pairSoftAccounts - pair soft accounts together

curl https://api.glome.me/connections/{glomeid}/establish -X
POST -d
pairing[code_1]=9042 -d
pairing[code_2]=15e8 -d
pairing[code_3]=194c -d
application[apikey]={apikey} -d 
application[uid]={uid}


*/
function pairSoftAccounts ( key ) {
	
	$.ajax({
	
	    // The URL for the request
	    // here we use the GlomeID to get the right user data
	    url: "https://api.glome.me/connections/"+localStorage.getItem('GlomeID')+"/establish",
	 
	    // The data to send (will be converted to a query string)
	    data: {
	      apikey: "e0e654812d11223d009f0191e2fb89ef",
				apiuid: "get.glome.me",
				code: key
	    },
	
	    // Whether this is a POST or GET request
	    type: "POST",
	 
	    // The type of data we expect back
	    dataType : "json",
	 
	    // Code to run if the request succeeds;
	    // the response is passed to the function
	    success: function( json ) {
	        
	        // json is an array/object and we only get one
	        // we can push it to html
	        $( "#pair-title" ).html( "Pairing success!" );
					
					// let's collect all JSON items to a Sting
	        var items = "";
	        
	        // looping through the records
	        items = loopThrough ( json, items );
					
					$( "#pair-status" ).html( "<pre>"+ items +"</pre>" );       
	        
	    },
	 
	    // Code to run if the request fails; the raw request and
	    // status codes are passed to the function
	    error: function( xhr, status, errorThrown ) {
	    		var txt = "Problem pairing the SoftAccounts!";
	    		txt += "<br><br> xhr: <pre>" + JSON.stringify(xhr, null, 2) + "</pre>";
	    		
	        $( "#pair-status" ).html( txt );
	    }
	    
	// end of set User data
	});
	
}

/***

listPairedAccounts - pair soft accounts together

curl https://api.glome.me/connections/{glomeid}/list -X
POST -d
application[apikey]={apikey} -d 
application[uid]={uid}

*/
function listPairedAccounts ( ) {
	
	$.ajax({
	    
	    // The URL for the request
	    // here we use the GlomeID to get the right user data
	    url: "https://api.glome.me/connections/"+localStorage.getItem('GlomeID')+"/list",
	 
	    // The data to send (will be converted to a query string)
	    data: {
	      apikey: "e0e654812d11223d009f0191e2fb89ef",
				apiuid: "get.glome.me"
	    },
	
	    // Whether this is a POST or GET request
	    type: "GET",
	 
	    // The type of data we expect back
	    dataType : "json",
	 
	    // Code to run if the request succeeds;
	    // the response is passed to the function
	    success: function( json ) {
	        
	        // json is an array/object and we only get one
	        // we can push it to html
	        $( "#device-title" ).html( "Listing paired soft accounts." );
					
					// let's collect all JSON items to a Sting
	        var items = "";
	        
	        // looping through the records
	        items = loopThrough ( json, items );
					
					$( "#device-status" ).html( "<pre>"+ items +"</pre>" );       
	        
	    },
	 
	    // Code to run if the request fails; the raw request and
	    // status codes are passed to the function
	    error: function( xhr, status, errorThrown ) {
	    		var txt = "Problem listing the paired SoftAccount!";
	    		txt += "<br><br> xhr: <pre>" + JSON.stringify(xhr, null, 2) + "</pre>";
	    		
	        $( "#device-status" ).html( txt );
	    }
	    
	// end of set User data
	});
	
}

/***
updateData - Save data to GlomeID 

@param txt - data to save

Now we set some data to the GlomeID. This data could be set just to localstorage
but we will link several devices together so we want this data to be accessible
in all paired devices.

curl https://api.glome.me/data/{glomeid}/save -X
POST -d 
userdata[content]=start -d 
userdata[subject_id]=112 -d 
userdata[kind]=x -d 
application[apikey]={apikey} -d 
application[uid]={uid}

*/
function updateData ( txt ) {

	console.log("Updating data to server: "+ txt );

	$.ajax({
	
	    // The URL for the request
	    // here we use the GlomeID to get the right user data
	    url: "https://api.glome.me/data/"+localStorage.getItem('GlomeID')+"/save",
	 
	    // The data to send (will be converted to a query string)
	    data: {
		    content: txt,
		    kind: "s",
	      apikey: "e0e654812d11223d009f0191e2fb89ef",
				apiuid: "get.glome.me"
	    },
	
	    // Whether this is a POST or GET request
	    type: "POST",
	 
	    // The type of data we expect back
	    dataType : "json",
	 
	    // Code to run if the request succeeds;
	    // the response is passed to the function
	    success: function( json ) {
	        
	        // json is an array/object and we only get one
	        // we can push it to html
	        $( "#title" ).html( "Game data saved" );
					
					$( "#content" ).html( "Saved data: "+txt );        
	        
	    },
	 
	    // Code to run if the request fails; the raw request and
	    // status codes are passed to the function
	    error: function( xhr, status, errorThrown ) {
	    		var txt = "Problem saving data to the SoftAccount!";
	    		txt += "<br><br> xhr: <pre>" + JSON.stringify(xhr, null, 2) + "</pre>";
	    		
	        $( "#status" ).html( txt );
	    }
	    
	// end of set User data
	});
	
}

