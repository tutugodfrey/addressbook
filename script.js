
const Contacts = class {
	constructor() {
		// array to hold contact info
		this.contactDetails = [];
		console.log(this.contactDetails);
	}
 	newEvent(elementObject,  eventType, callBack, callBackArgument) {
    if(elementObject.addEventListener){
      elementObject.addEventListener(eventType, function(event) {
      event.preventDefault(); 
        if(callBackArgument === undefined) {
          callBack();
        } else {
          callBack(callBackArgument);
        }
      },
      false );
    } else if (element_object.attachEvent) {
      elementObject.attachEvent("on"+ eventType, function(event){
      event.preventDefault(); 
        if(callBackArgument === undefined) {
          callback();
        } else {
          callBack(callBackArgument);
        }
      });
    }
  }   // end newEvent

 	addContact() {
  	console.log('want to add new contact now');
  	  const newContact = {};
  	if(document.getElementById('fullname')) {
  		const fullname = document.getElementById('fullname').value;
  		newContact['fullname'] = fullname;
  		// console.log(fullname);
  	}

  	if(document.getElementById('address')) {
  		const address = document.getElementById('address').value;
  		newContact['address'] = address;
  	}

  	if(document.getElementById('email')) {
  		const email = document.getElementById('email').value;
  		newContact['email'] = email;
  	}

  	if(document.getElementById('phone')) {
  		const phone = document.getElementById('phone').value;
  		newContact['phone'] = phone;
  	}

  	this.contactDetails.push(newContact);
  	// console.log(contactDetails);
  	 console.log(newContact);
  } // end addContact
}

const contacts = new Contacts();

// add contact
if(document.getElementById('add-contact')) {
	const addContactButton = document.getElementById('add-contact');
	contacts.newEvent(addContactButton, 'click', contacts.addContact);
}