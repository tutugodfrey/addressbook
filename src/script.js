
let updateContactInfo = false;
let confirmDelete = false;
let idOfSelectedContact;

const Contacts = class {
 	static newEvent(elementObject,  eventType, callBack, callBackArgument) {
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

  /*
  * get the value of a field in an object
  * given the object and the field you wish to get the value
  * return undefined if the field is not found
  */
  static getFields(objCollector, field) {
    if (objCollector[field]) {
      return objCollector[field];
    }
    return undefined;
  }

  /*
  * given an array of objects
  * to get an object by checking the value of a field
  * supply the array of objects, the field to check for and the value of the field
  * return the object if the fieldValue match
  * otherwise return error message
  */
  static getObjectByField(arrayOfObjects, objectField, fieldValue) {
    for(let objCollection of arrayOfObjects) {
      // const objCollection = arrayOfObjects[arraySize];
      if (objCollection[objectField] === fieldValue) {
        return objCollection;
      }
    }
    return `No object with field ${objectField} found`;
  }

  static closeContactInfo() {
    if(document.getElementById('show-contact-info')) {
      const showContactInfo = document.getElementById('show-contact-info');
      if(document.getElementById('contact-info-container')) {
        const contactInfoTable = document.getElementById('contact-info-container');
        showContactInfo.removeChild(contactInfoTable);
      }  
    }
  }

  static closeErrorBox() {
    if(document.getElementById('error-box')) {
      const errorBox = document.getElementById('error-box');
      errorBox.setAttribute('class', 'hide-item');
    }
  }

  static updateContact(idOfSelectedContact) {
    const listOfContacts = getContactFromStore();
    let selectedConctact;
    for(let contactDetail of listOfContacts) {
      if (contactDetail['id'] === idOfSelectedContact) {
        selectedConctact = contactDetail;
      }
    }

    if(document.getElementById('fullname')) {
      const fullname = document.getElementById('fullname');
      fullname.value = selectedConctact['fullname'];
    }

    if(document.getElementById('address')) {
      const address = document.getElementById('address');
      address.value = selectedConctact['address'];
    }

    if(document.getElementById('email')) {
      const email = document.getElementById('email');
      email.value  = selectedConctact['email'];
    }

    if(document.getElementById('phone')) {
      const phone = document.getElementById('phone');
      phone.value = selectedConctact['phone'];
    }
    updateContactInfo = true;

    if(document.getElementById('show-contact-info')) {
      const showContactInfo = document.getElementById('show-contact-info');
      if(document.getElementById('contact-info-container')) {
        const contactInfoContainer = document.getElementById('contact-info-container');
        showContactInfo.removeChild(contactInfoContainer);
      }  
    }
  }

  static deleteContact(idOfSelectedContact) {
    confirmDelete = confirm('Do you really want to delete this contact from list');
    if(confirmDelete) {
      const listOfContacts = getContactFromStore();
      let selectedConctact;
      for(let contactDetail of listOfContacts) {
        if (contactDetail['id'] === idOfSelectedContact) {
          selectedConctact = contactDetail;
        }
      } 

      const indexOfSelected = listOfContacts.indexOf(selectedConctact);
      listOfContacts.splice(indexOfSelected, 1);
      saveContactsToStore(listOfContacts);
      displayContactList();
      if(document.getElementById('show-contact-info')) {
        const showContactInfo = document.getElementById('show-contact-info');
        if(document.getElementById('contact-info-container')) {
          const contactInfoContainer = document.getElementById('contact-info-container');
          showContactInfo.removeChild(contactInfoContainer);
        }  
      }
    }
  }
} // end class definition 

function saveAddressBook() {
  if(!localStorage.getItem('addressBook')) {
    let listOfContacts = [];
    const confirmStorage = true;
    listOfContacts = JSON.stringify(listOfContacts);
    if(confirmStorage) {
      console.log('System store contacts on the browsers localStorage');
      localStorage.setItem('addressBook', listOfContacts);
    }
  } else if(localStorage.getItem('addressBook')) {
    listOfContacts = localStorage.getItem('addressBook');
    listOfContacts = JSON.parse(listOfContacts);
  }
}

// display stored contacts when app load
displayContactList();

function addContact() {
  let listOfContacts = getContactFromStore(); 
  let contactId;
  const newContact = {};
  if(updateContactInfo) {
    contactId = idOfSelectedContact;
  } else {
    if(listOfContacts.length === 0) {
      contactId = 1
    } else {
      const indexOfLastContact = listOfContacts.length - 1;
      const lastContactId = Contacts.getFields(listOfContacts[indexOfLastContact], 'id');
      contactId = lastContactId + 1;
    }
  }

  newContact['id'] = contactId;
  if(document.getElementById('fullname')) {
    const fullnameInput = document.getElementById('fullname');
    const fullname = fullnameInput.value;
    if(typeof fullname === 'string' && fullname.length >= 1) {
      newContact['fullname'] = fullname;
    } else {
      console.log('names must be aphabetical characters')
    } 
    fullnameInput.value = '';
  }

  if(document.getElementById('address')) {
    const addressInput = document.getElementById('address');
    const address = addressInput.value;
    if(address) {
      if(typeof address === 'string' && address.length >= 1 ) {
        newContact['address'] = address;
      } else {
        console.log('address must be aphabetical characters')
      }
    }
    newContact['address'] = address;
    addressInput.value = '';
  }

  if(document.getElementById('email')) {
    const emailInput = document.getElementById('email');
    const email = emailInput.value;
    // accept only valid email
    if(email) {
      const emailRegExp = /\w+@\w+\.(net|com|org)/;
      const validEmail = emailRegExp.test(email)
      if(validEmail) {
        newContact['email'] = email;
      } else {
        displayErrorMessage('Invalid Email');
        return;
      }
    }
    newContact['email'] = email;
    emailInput.value = '';
  }

  if(document.getElementById('phone')) {
    const phoneInput = document.getElementById('phone');
    const phone = phoneInput.value;
    const lengthOfPhoneNum = phone.length;
    const phoneNumber = parseInt(phone, 10);
    if(phone) {
      if((typeof phoneNumber === 'number') && (lengthOfPhoneNum === 11)) {
        newContact['phone'] = phone;
      } else {
        console.log('invalid phone number');
      }
    }
    newContact['phone'] = phone;
    phoneInput.value = '';
  }

  if(newContact['fullname'] && newContact['address'] || newContact['email'] || newContact['phone']) {
    // everything ok
    if(updateContactInfo) {
      const contactToUpdate = Contacts.getObjectByField(listOfContacts, 'id', contactId);
      const indexOfSelected = listOfContacts.indexOf(contactToUpdate);
      listOfContacts[indexOfSelected] = newContact;
      updateContactInfo = false;
    } else {
      listOfContacts.push(newContact);
    }

    saveContactsToStore(listOfContacts); 
    displayContactList(listOfContacts);
  } else {
    displayErrorMessage('You must include a name and any/ all of address, email, phone to save');
    return;
  }
} // end addContact


// add contact
if(document.getElementById('add-contact')) {
	const addContactButton = document.getElementById('add-contact');
	Contacts.newEvent(addContactButton, 'click', addContact);
}

function getContactFromStore() {
  if(localStorage.getItem('addressBook')) {
    let listOfContacts = localStorage.getItem('addressBook');
    listOfContacts = JSON.parse(listOfContacts);
    return listOfContacts;
  }
  return undefined;
}

function saveContactsToStore(listOfContacts) {
  listOfContacts = JSON.stringify(listOfContacts)
  localStorage.setItem('addressBook', listOfContacts);
}

function displayContactList() {
  saveAddressBook();
  const listOfContacts = getContactFromStore();
  if(document.getElementById('address-list')) {
    const head = document.createElement('h4');
    head.id = 'contact-list-title';
    const unorderedList = document.createElement('ul');
    const contactDiv = document.getElementById('address-list');
    let headTitle;
    if(listOfContacts.length === 0) {
      headTitle = document.createTextNode('No contact yet, start adding contant');
      head.appendChild(headTitle);
      contactDiv.appendChild(head);
    } else if (listOfContacts.length > 0) {
      // remove defualt head
      if(document.getElementById('contact-list-title')) {
        const contactListTitle = document.getElementById('contact-list-title');
        headTitle = document.createTextNode('Contacts');
        head.appendChild(headTitle);
        contactDiv.removeChild(contactListTitle);
        contactDiv.appendChild(head);
      } else {
        const contactListTitle = document.getElementById('contact-list-title');
        headTitle = document.createTextNode('Contacts');
        head.appendChild(headTitle);
        contactDiv.appendChild(head);
      }

      unorderedList.id = 'contact-list';
      let listItems;
      listOfContacts.forEach((contact) => {
      listItems = document.createElement('li');
      listItems.id = contact.id;
      listItems.className = 'contact-items';
      listItems.innerHTML = contact.fullname;
      unorderedList.appendChild(listItems);
      });
      if(document.getElementById('contact-list')) {
        const contactList = document.getElementById('contact-list');
        contactDiv.removeChild(contactList);
        contactDiv.appendChild(unorderedList);
      } else {
        contactDiv.appendChild(unorderedList);
      }  
    }
  }
  checkContact();
}

function checkContact() {
  if(document.getElementById('contact-list')) {
    const contactList = document.getElementsByClassName('contact-items');
    const contactSize = contactList.length;
    for(let size = 0; size < contactSize; size++) {
      Contacts.newEvent(contactList[size], 'click', displayContactInfo, contactList[size]);
    }
  }
}

function displayContactInfo(contactItem) {
  let itemId = contactItem.getAttribute('id');
  itemId = parseInt(itemId, 10);
  idOfSelectedContact = itemId;
  const contactInfo = Contacts.getObjectByField(listOfContacts, 'id', itemId);
  let { id, fullname, address, email, phone } = contactInfo;
  let showContactInfo;
  if(document.getElementById('show-contact-info')) {
    showContactInfo = document.getElementById('show-contact-info');
  }
  // include button to close info
  const closeContactInfo = document.createElement('button');
  closeContactInfo.id = 'close-contact-info';
  closeContactInfo.innerHTML = 'X';

  // include button to update contact
  const updateContact = document.createElement('button');
  updateContact.id = 'update-contact';
  updateContact.innerHTML = 'Update Contact';

  // include button to delete the selected contact
  const deleteContact = document.createElement('button');
  deleteContact.id = 'delete-contact';
  deleteContact.innerHTML = 'Delete';

  const InfoContainer = document.createElement('div');
  InfoContainer.id = 'contact-info-container';
  const contactTitle = document.createElement('h4');
  contactTitle.innerHTML = fullname;

  // item address
  const descriptiveListContainer = document.createElement('dl');
  const addressField = document.createElement('dt');
  addressField.innerHTML = 'Address:';
  const addressValue = document.createElement('dd');
  if(!address) {
    address = 'No address';
  }
  addressValue.innerHTML = address;
  descriptiveListContainer.appendChild(addressField);
  descriptiveListContainer.appendChild(addressValue);

  // item email
  const emailField = document.createElement('dt');
  emailField.innerHTML = 'Email:';
  const emailValue = document.createElement('dd');
  if(!email) {
    email = 'No email';
  }
  emailValue.innerHTML = email;
  descriptiveListContainer.appendChild(emailField);
  descriptiveListContainer.appendChild(emailValue);

  // item phone
  const phoneRow = document.createElement('div');
  const phoneField = document.createElement('dt');
  phoneField.innerHTML = 'Phone:';
  const phoneValue = document.createElement('dd');
  if(!phone) {
    phone = 'No phone';
  }
  phoneValue.innerHTML = phone;
  descriptiveListContainer.appendChild(phoneField);
  descriptiveListContainer.appendChild(phoneValue); 

  InfoContainer.appendChild(closeContactInfo);
  InfoContainer.appendChild(contactTitle);
  InfoContainer.appendChild(descriptiveListContainer);
  InfoContainer.appendChild(updateContact);
  InfoContainer.appendChild(deleteContact);

  if(document.getElementById('contact-info-container')) {
  const contactInfoTable = document.getElementById('contact-info-container');
  showContactInfo.removeChild(contactInfoTable);
  showContactInfo.appendChild(InfoContainer);
  } else {
    showContactInfo.appendChild(InfoContainer);
  } 
  domNotifier();
}

function displayErrorMessage(message) {
  if(document.getElementById('error-box')) {
    const errorBox = document.getElementById('error-box');
    const messageBody = document.createElement('p');
    messageBody.id = 'message-text';
    messageBody.innerHTML = message;
    if(document.getElementById('message-text')) {
      const messageText = document.getElementById('message-text');
      errorBox.removeChild(messageText);
      errorBox.appendChild(messageBody);
    } else {
      errorBox.appendChild(messageBody);
    }

    if(document.getElementById('error-box')) {
      const errorBox = document.getElementById('error-box');
      errorBox.setAttribute('class', 'show-item');
      domNotifier();
    }
  }
}
function domNotifier() {
  if(document.getElementById('close-contact-info')) {
    const closeContactButton = document.getElementById('close-contact-info');
    Contacts.newEvent(closeContactButton, 'click', Contacts.closeContactInfo);
  }

  if(document.getElementById('update-contact')) {
    const updateContactButton = document.getElementById('update-contact');
    Contacts.newEvent(updateContactButton, 'click', Contacts.updateContact, idOfSelectedContact);
  }

  if(document.getElementById('delete-contact')) {
    const deleteContactButton = document.getElementById('delete-contact');
    Contacts.newEvent(deleteContactButton, 'click', Contacts.deleteContact, idOfSelectedContact);
  }

  if(document.getElementById('close-error-message')) {
      const closeErrorButton = document.getElementById('close-error-message');
       Contacts.newEvent(closeErrorButton, 'click', Contacts.closeErrorBox);
    }
}
