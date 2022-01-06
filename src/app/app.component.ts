import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  list1: number[] = [];
  list2: number[] = [];
  list3: number[] = [];
  list4: number[] = [];

  undoList: any[] = [];

  ngOnInit() {
    if (this.getFromLocalStorage('isInitialised')) {
      this.undoList = this.getFromLocalStorage('undoList', true);
      this.list1 = this.getFromLocalStorage('list1', true);
      this.list2 = this.getFromLocalStorage('list2', true);
      this.list3 = this.getFromLocalStorage('list3', true);
      this.list4 = this.getFromLocalStorage('list4', true);
    } else {
      this.setToLocalStorage('isInitialised', true);

      this.undoList = [];
      this.list1 = this.getData();
      this.list2 = this.getData();
      this.list3 = this.getData();
      this.list4 = this.getData();

      this.saveListsToStorage();
    }
  }

  saveListsToStorage() {
    this.setToLocalStorage('list1', this.list1, true);
    this.setToLocalStorage('list2', this.list2, true);
    this.setToLocalStorage('list3', this.list3, true);
    this.setToLocalStorage('list4', this.list4, true);
    this.setToLocalStorage('undoList', this.undoList, true);
  }

  getFromLocalStorage(key: string, isJSON = false) {
    const value = localStorage.getItem(key) || '';
    if (isJSON) {
      return JSON.parse(value);
    }
    return value;
  }

  setToLocalStorage(key: string, value: any, isJSON = false) {
    if (isJSON) {
      value = JSON.stringify(value);
    }
    localStorage.setItem(key, value);
  }

  getData() {
    const numbers: number[] = [];

    let i = 0;
    while (i < 10) {
      const newNumber = ~~(Math.random() * 100) % 30;
      if (numbers.indexOf(newNumber) === -1) {
        numbers.push(newNumber);
        i++;
      }
    }
    numbers.sort((a, b) => a - b);
    return numbers;
  }

  deleteFromLists(item: number, fromList: string) {
    const removedItem: { value: number, listsDetail: any[] } = {
      value: item,
      listsDetail: []
    };

    // check item in every list
    const indexList1 = this.list1.indexOf(item);
    const indexList2 = this.list2.indexOf(item);
    const indexList3 = this.list3.indexOf(item);
    const indexList4 = this.list4.indexOf(item);

    if (indexList1 !== -1) {
      removedItem.listsDetail.push({ list: 'list1', index: indexList1 });
      this.list1.splice(indexList1, 1);
    }
    if (indexList2 !== -1) {
      removedItem.listsDetail.push({ list: 'list2', index: indexList2 });
      this.list2.splice(indexList2, 1);
    }
    if (indexList3 !== -1) {
      removedItem.listsDetail.push({ list: 'list3', index: indexList3 });
      this.list3.splice(indexList3, 1);
    }
    if (indexList4 !== -1) {
      removedItem.listsDetail.push({ list: 'list4', index: indexList4 });
      this.list4.splice(indexList4, 1);
    }

    this.undoList.push(removedItem);
    this.saveListsToStorage();
  }

  undoListItem() {
    const lastDeleteItem = this.undoList.pop();
    const { value, listsDetail } = lastDeleteItem;

    for (let listDetail of listsDetail) {
      switch (listDetail.list) {
        case 'list1': this.list1.splice(listDetail.index, 0, value); break;
        case 'list2': this.list2.splice(listDetail.index, 0, value); break;
        case 'list3': this.list3.splice(listDetail.index, 0, value); break;
        case 'list4': this.list4.splice(listDetail.index, 0, value); break;
      }
    }

    this.saveListsToStorage();
  }
}
