
let updateContactInfo = false;
let confirmDelete = false;
let idOfSelectedContact;
// implement persistent with localStorage
// localStorage.removeItem('addressBook')

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
      if(document.getElementById('contact-info-table')) {
        const contactInfoTable = document.getElementById('contact-info-table');
        showContactInfo.removeChild(contactInfoTable);
      }  
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
        if(document.getElementById('contact-info-table')) {
          const contactInfoTable = document.getElementById('contact-info-table');
          showContactInfo.removeChild(contactInfoTable);
        }  
      }
    }
  }
} // end class definition 
 // const contacts = new Contacts();

function saveAddressBook() {
  if(!localStorage.getItem('addressBook')) {
    let listOfContacts = [];
    const confirmStorage = confirm('Allow this program to store my contacts on this browser');
    listOfContacts = JSON.stringify(listOfContacts);
    if(confirmStorage) {
      console.log('system store contacts on the browsers localStorage');
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
  let listOfContacts;
  if(localStorage.getItem('addressBook')) {
    listOfContacts = localStorage.getItem('addressBook');
    listOfContacts = JSON.parse(listOfContacts);
  }
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
      fullnameInput.value = '';
    } else {
      console.log('names must be aphabetical characters')
    } 
  }

  if(document.getElementById('address')) {
    const addressInput = document.getElementById('address');
    const address = addressInput.value;
    if(typeof address === 'string' && address.length >= 1 ) {
      newContact['address'] = address;
      addressInput.value = '';
    } else {
      console.log('address must be aphabetical characters')
    }
  }

  if(document.getElementById('email')) {
    const emailInput = document.getElementById('email');
    const email = emailInput.value;
    // accept only valid email
    const emailRegExp = /\w+@\w+\.(net|com|org)/;
    const validEmail = emailRegExp.test(email)
    if(validEmail) {
      newContact['email'] = email;
      emailInput.value = '';
    } else {
      console.log('invalid Email');
    }
  }

  if(document.getElementById('phone')) {
    const phoneInput = document.getElementById('phone');
    const phone = phoneInput.value;
    const lengthOfPhoneNum = phone.length;
    const phoneNumber = parseInt(phone, 10);
    if((typeof phoneNumber === 'number') && (lengthOfPhoneNum === 11)) {
      newContact['phone'] = phone;
      phoneInput.value = '';
    } else {
      console.log('invalid phone number');
    }
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

    listOfContacts = JSON.stringify(listOfContacts)
    localStorage.setItem('addressBook', listOfContacts);
    displayContactList(listOfContacts);
  } else {
    console.log('you must start a name and any of address, email, phone');
    console.log(newContact);
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

  const table = document.createElement('table');
  table.id = 'contact-info-table';
  const tableRow = document.createElement('tr');
  const tableHead = document.createElement('th');
  const tableCell = document.createElement('td');
  tableHead.innerHTML = fullname;
  const contactTitle = tableRow;
  contactTitle.appendChild(tableHead);
  // table row for address
  const addressRow = document.createElement('tr');
  const addressField = document.createElement('td');
  addressField.innerHTML = 'Address:';
  const addressValue = document.createElement('td');
  if(!address) {
    address = 'No address';
  }
  addressValue.innerHTML = address;
  addressRow.appendChild(addressField);
  addressRow.appendChild(addressValue);

  // table row for email
  const emailRow = document.createElement('tr');
  const emailField = document.createElement('td');
  emailField.innerHTML = 'Email:';
  const emailValue = document.createElement('td');
  if(!email) {
    email = 'No email';
  }
  emailValue.innerHTML = email;
  emailRow.appendChild(emailField);
  emailRow.appendChild(emailValue);

  // table row for phone
  const phoneRow = document.createElement('tr');
  const phoneField = document.createElement('td');
  phoneField.innerHTML = 'Phone:';
  const phoneValue = document.createElement('td');
  if(!phone) {
    phone = 'No phone';
  }
  phoneValue.innerHTML = phone;
  phoneRow.appendChild(phoneField);
  phoneRow.appendChild(phoneValue); 

  table.appendChild(closeContactInfo);
  table.appendChild(contactTitle);
  table.appendChild(addressRow);
  table.appendChild(emailRow);
  table.appendChild(phoneRow);
  table.appendChild(updateContact);
  table.appendChild(deleteContact);

  if(document.getElementById('contact-info-table')) {
  const contactInfoTable = document.getElementById('contact-info-table');
  showContactInfo.removeChild(contactInfoTable);
  showContactInfo.appendChild(table);
  } else {
    showContactInfo.appendChild(table);
  } 
  domNotifier();
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
}
