import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import {
  TreeGridComponent,
  RowDDService,
  SelectionService,
  SortService,
  EditService,
  ToolbarService,
  FilterService,
} from '@syncfusion/ej2-angular-treegrid';

import { Treerow } from './treerow';
import { v4 as uuidv4 } from 'uuid';
import { BeforeOpenCloseEventArgs } from '@syncfusion/ej2-inputs';
import { DropDownList } from '@syncfusion/ej2-dropdowns';
import { NumericTextBoxComponent } from '@syncfusion/ej2-angular-inputs';

import { DialogComponent } from '@syncfusion/ej2-angular-popups';
import { EmitType } from '@syncfusion/ej2-base';
import { HttpClient } from '@angular/common/http';
import { FormGroup } from '@angular/forms';
import {
  DataManager,
  WebApiAdaptor,
  Query,
  ReturnOption,
} from '@syncfusion/ej2-data';

import { addClass, removeClass } from '@syncfusion/ej2-base';
import { CheckBoxComponent } from '@syncfusion/ej2-angular-buttons';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  providers: [
    RowDDService,
    SelectionService,
    SortService,
    ToolbarService,
    EditService,
    FilterService,
  ],

  encapsulation: ViewEncapsulation.None,
  styleUrls: ['app.component.css'],
})
export class AppComponent {
  @ViewChild('taskName')
  public taskNameM: CheckBoxComponent;
  @ViewChild('duration')
  public durationM: CheckBoxComponent;
  @ViewChild('startDate')
  public startDateM: CheckBoxComponent;
  @ViewChild('endDate')
  public endDateM: CheckBoxComponent;
  @ViewChild('priority')
  public priorityM: CheckBoxComponent;
  @ViewChild('progress')
  public progressM: CheckBoxComponent;

  @ViewChild('Dialog')
  public dialogObj: DialogComponent;
  public isModal: boolean = true;
  public data: Object[] = [];
  public dm: DataManager;
  // public data: DataManager;
  public editSettings: EditSettingsModel;
  public Properties: boolean = false;
  public selectOptions: Object;

  public ddlfields: Object;

  public format: Object;
  public fields: Object;
  public selectedRow: any;
  public copiedRow: any;
  public pageSetting: Object;
  public ColType: string = '';
  ColAlign: string = '';
  ColChecked: boolean = false;
  ColMinWidth: number;
  ColFColor: string = '';
  ColBColor: string = '';
  checkNewEdit: string;
  public rowIndex: number;

  public selectionOptions: SelectionSettingsModel;

  public formatOptions: Object;
  public editOptions: Object;
  public stringRule: Object;
  public taskidRule: Object;
  public progressRule: Object;
  public dateRule: Object;
  /**buttons */
  public nde: boolean = false;
  /*** */
  @ViewChild('columns')
  public columns: NumericTextBoxComponent;
  @ViewChild('ejDialog') ejDialog: DialogComponent;
  columnValue: number;
  columnField: string;
  public dateformat: Object;
  @ViewChild('treegrid')
  public treegrid: TreeGridComponent;
  public contextMenuItems: Object;
  public templateOptions: object;
  public filtering: boolean = false;
  public showChooser: boolean = false;
  public MultiSelect: boolean = false;
  public textWrap: boolean = false;
  public allowResizing: boolean = false;
  public showEditColumn: boolean = false;
  public addNew: boolean = false;
  public ColName: string = '';
  public allowDAD: boolean = false;
  public allowReorder: boolean = false;

  public filterSettings: Object;
  public dropDownFilter: DropDownList;
  public toolbar: string[];

  public listHeaders: any = [
    {
      field: 'TaskID',
      headerText: 'Task ID',
      isPrimaryKey: true,
      allowFiltering: false,
      allowSorting: false,
      // editType: "defaultedit",
    },
    {
      field: 'TaskName',
      headerText: 'Task Name',
      editType: 'stringedit',
      type: 'string',
    },
    {
      field: 'StartDate',
      headerText: 'Start Date',
      type: 'date',
      format: 'dd/MM/yyyy',
      textAlign: 'Right',
      editType: 'datepickeredit',
    },
    {
      field: 'EndDate',
      headerText: 'End Date',
      format: 'yMd',
      textAlign: 'Right',
      editType: 'datepickeredit',
      type: 'date',
    },
    {
      field: 'Duration',
      headerText: 'Duration',
      textAlign: 'Right',
      editType: 'numericedit',
      type: 'number',
    },

    {
      field: 'Progress',
      headerText: 'Progress',

      textAlign: 'Right',
      editType: 'stringedit',
      type: 'string',
    },
    {
      field: 'Priority',
      headerText: 'Priority',
      editType: 'dropdownedit',
      type: 'string',
    },
  ];

  public fieldData: any = [];
  public cutRow: any;
  public cutRowBool: boolean = false;

  // public contextMenuItems: any;
  public treeColumns: any;

  public dataManager: DataManager = new DataManager({
    url: 'https://vom-app.herokuapp.com/tasks?limit=14000',
    updateUrl: 'https://vom-app.herokuapp.com/tasks',
    insertUrl: 'https://vom-app.herokuapp.com/tasks',
    removeUrl: 'https://vom-app.herokuapp.com/tasks',
    crossDomain: true,
    adaptor: new WebApiAdaptor(),
  });
  constructor(private http: HttpClient) {}
  ngOnInit(): void {
    this.selectionOptions = {
      type: 'Multiple',
      mode: 'Row',
    };
    this.treeColumns = this.listHeaders;
    this.formatOptions = { format: 'M/d/y hh:mm a', type: 'dateTime' };
    this.progressRule = { number: true, min: 0 };
    this.taskidRule = { required: true, number: true };
    this.dateRule = { date: true };
    this.stringRule = { required: true };
    this.dataManager
      .executeQuery(new Query())
      .then((e: ReturnOption) => (this.data = e.result.data as object[]))
      .catch((e) => true);

    this.pageSetting = { pageCount: 3 };

    this.format = { format: 'M/d/yyyy', type: 'date' };

    this.ddlfields = { text: 'name', value: 'id' };

    this.fields = { text: 'type', value: 'id' };
    this.dateformat = { type: 'dateTime', format: 'dd/MM/yyyy' };
    this.contextMenuItems = [
      {   id: 'cut',
      text: 'Cut',
      target: '.e-content',
      iconCss: 'e-cm-icons e-cut' },

      { text: 'Paste Sibling', target: '.e-content', id: 'rsibling' },
      { text: 'Paste Child', target: '.e-content', id: 'rchild' },
    ];
    this.filterSettings = {
      type: 'FilterBar',
      hierarchyMode: 'Parent',
      mode: 'Immediate',
    };
    this.templateOptions = {
      create: (args: { element: Element }) => {
        let dd: HTMLInputElement = document.createElement('input');
        dd.id = 'duration';
        return dd;
      },
      write: (args: { element: Element }) => {
        let dataSource: string[] = ['All', '1', '3', '4', '5', '6', '8', '9'];
        this.dropDownFilter = new DropDownList({
          dataSource: dataSource,
          value: 'All',
          change: (e: ChangeEventArgs) => {
            let valuenum: any = +e.value;
            let id: any = <string>this.dropDownFilter.element.id;
            let value: any = <string>e.value;
            if (value !== 'All') {
              this.treegrid.filterByColumn(id, 'equal', valuenum);
            } else {
              this.treegrid.removeFilteredColsByField(id);
            }
          },
        });
        this.dropDownFilter.appendTo('#Duration');
      },
    };
  }

  actionComplete(args: EditEventArgs) {
    if (args.requestType == 'save' && args.action == 'add') {
      const body = {
        TaskID: 0,
        TaskName: args.data.TaskName,
        StartDate: args.data.StartDate,
        EndDate: args.data.EndDate,
        Duration: args.data.Duration,
        Progress: args.data.Progress,
        Priority: args.data.Priority,
        ParentItem: null,
        isParent: args.data.isParent,
      };
      this.http
        .post<any>('https://vom-app.herokuapp.com/tasks', body)
        .subscribe((data) => {
          console.log(data);
          this.dataManager
            .executeQuery(new Query())
            .then((e: ReturnOption) => (this.data = e.result.data as object[]))
            .catch((e) => true);
        });
    }
    if (args.requestType == 'save' && args.action == 'edit') {
      const body = {
        TaskID: args.data.TaskID,
        TaskName: args.data.TaskName,
        StartDate: args.data.StartDate,
        EndDate: args.data.EndDate,
        Duration: args.data.Duration,
        Progress: args.data.Progress,
        Priority: args.data.Priority,
        isParent: args.data.isParent,
      };
      this.http
        .put<any>('https://vom-app.herokuapp.com/tasks', body)
        .subscribe((data) => {
          console.log(data);
          this.dataManager
            .executeQuery(new Query())
            .then((e: ReturnOption) => (this.data = e.result.data as object[]))
            .catch((e) => true);
        });
    }
    if (args.requestType == 'save') {
      var index = args.index;
      this.treegrid.selectRow(index); // select the newly added row to scroll to it
    }
  }

  contextMenuOpen(arg?: BeforeOpenCloseEventArgs): void {
    this.rowIndex = arg.rowInfo.rowIndex;
    let elem: Element = arg.event.target as Element;

    let row: Element = elem.closest('.e-row');
    let uid: string = row && row.getAttribute('data-uid');
    let items: Array<HTMLElement> = [].slice.call(
      document.querySelectorAll('.e-menu-item')
    );
    for (let i: number = 0; i < items.length; i++) {
      items[i].setAttribute('style', 'display: none;');
    }
    if (elem.closest('.e-row')) {
      document
      .querySelectorAll('li#cut')[0]
      .setAttribute('style', 'display: block;');

      document
        .querySelectorAll('li#rsibling')[0]
        .setAttribute('style', 'display: block;');

      document
        .querySelectorAll('li#rchild')[0]
        .setAttribute('style', 'display: block;');
      // }
    }
  }

  contextMenuClick(args): void {
    if (args.item.text == 'Cut') {
      this.flag = true;
      // for (
      //   var i = 0;
      //   i < this.treegrid.getSelectedRowCellIndexes()[0].cellIndexes.length;
      //   i++
      // ) {
      //   this.fieldData.push(
      //     this.treegrid.getColumnByIndex(
      //       this.treegrid.getSelectedRowCellIndexes()[0].cellIndexes[i]
      //     ).field
      //   );
      // }
      // this.cutIndex = this.treegrid.getSelectedRowCellIndexes();
      // this.treegrid.copyHierarchyMode = 'None';
      // this.treegrid.copy();
      this.cutRow = this.treegrid.getRowByIndex(this.rowIndex);
      this.cutRowBool = true;
      this.treegrid.copyHierarchyMode = 'None';
      this.treegrid.copy();
      this.cutRow.setAttribute('style', 'background:#FFC0CB;');
    }
    if (args.item.id == 'rsibling') {
     
      var copyContent = this.treegrid.clipboardModule.copyContent;

       
      var stringArray = copyContent.split('\t');
      let newRecord: Treerow = new Treerow(
        stringArray[0],
        stringArray[1],
        stringArray[2],
        stringArray[3],
        stringArray[4],
        stringArray[5],
        stringArray[6],
        this.selectedRow.data.ParentItem
      );
      newRecord.children = [];
      newRecord.isParent = true;
      newRecord.id = uuidv4();
      const body = {
        TaskID: newRecord.TaskID,
        TaskName: newRecord.TaskName,
        StartDate: newRecord.StartDate,
        EndDate: newRecord.EndDate,
        Duration: newRecord.Duration,
        Progress: newRecord.Progress,
        Priority: newRecord.Priority,
        isParent: newRecord.isParent,
        ParentItem: newRecord.ParentItem,
      };
      this.http
        .delete<any>(
          `https://vom-app.herokuapp.com/tasks/${newRecord.TaskID}`
        )
        .subscribe((data) => {
          console.log('post:------------------', data);
          this.treegrid.refresh();
          this.dataManager
            .executeQuery(new Query())
            .then(
              (e: ReturnOption) => (this.data = e.result.data as object[])
            )
            .catch((e) => true);
        });
      this.http
        .post<any>('https://vom-app.herokuapp.com/tasks', body)
        .subscribe((data) => {
          this.dataManager
            .executeQuery(new Query())
            .then(
              (e: ReturnOption) => (this.data = e.result.data as object[])
            )
            .catch((e) => true);
        });

      // this.treegrid.addRecord(newRecord, 0, 'Above');

      this.cutRowBool = false;
      this.copiedRow.setAttribute('style', 'background:white;');
    
    }

    if (args.item.id == 'rchild') {
      var copyContent = this.treegrid.clipboardModule.copyContent;

      // this.treegrid.paste(copyContent, rowIndex);

      var stringArray = copyContent.split('\t');
      let newRecord: Treerow = new Treerow(
        stringArray[0],
        stringArray[1],
        stringArray[2],
        stringArray[3],
        stringArray[4],
        stringArray[5],
        stringArray[6],
        this.selectedRow.data.TaskID
      );
      newRecord.children = [];
      newRecord.isParent = true;
      newRecord.id = uuidv4();
      const body = {
        TaskID: newRecord.TaskID,
        TaskName: newRecord.TaskName,
        StartDate: newRecord.StartDate,
        EndDate: newRecord.EndDate,
        Duration: newRecord.Duration,
        Progress: newRecord.Progress,
        Priority: newRecord.Priority,
        isParent: newRecord.isParent,
        ParentItem: newRecord.ParentItem,
      };
      this.http
        .delete<any>(
          `https://vom-app.herokuapp.com/tasks/${newRecord.TaskID}`
        )
        .subscribe((data) => {
          console.log('post:------------------', data);
          this.treegrid.refresh();
          this.http
            .post<any>('https://vom-app.herokuapp.com/tasks', body)
            .subscribe((data) => {
              this.dataManager
                .executeQuery(new Query())
                .then(
                  (e: ReturnOption) => (this.data = e.result.data as object[])
                )
                .catch((e) => true);
            });
        });

      // this.treegrid.addRecord(newRecord, 0, 'Above');

      this.cutRowBool = false;
      this.copiedRow.setAttribute('style', 'background:white;');
    
    } 
  }

  // Initialize the Dialog component's target element.
  initilaizeTarget: EmitType<object> = () => {
    this.targetElement = this.container.nativeElement.parentElement;
  };

  //Animation options
  public animationSettings: Object = {
    effect: 'Zoom',
    duration: 400,
    delay: 0,
  };

  rowSelected(args) {
    this.selectedRow = args;
  }
  copy() {
    this.copiedRow = this.treegrid.getRowByIndex(this.rowIndex);

    this.treegrid.copyHierarchyMode = 'None';
    this.treegrid.copy();
    this.copiedRow.setAttribute('style', 'background:#FFC0CB;');
  }
}
