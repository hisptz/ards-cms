// import {
//   Component,
//   OnInit,
//   Input,
//   OnChanges,
//   Output,
//   EventEmitter,
//   ChangeDetectionStrategy,
//   ChangeDetectorRef,
//   ViewChild
// } from "@angular/core";
// import { Observable } from "rxjs";
// import { TreeComponent } from "angular-tree-component/dist/components/tree.component";
// // import { assignedLowestLevelSelector } from "../../store/selectors/assigned-lowest-level.selector";

// @Component({
//   selector: "app-organisationunit-selector",
//   templateUrl: "./organisationunit-selector.component.html",
//   styleUrls: ["./organisationunit-selector.component.css"],
//   changeDetection: ChangeDetectionStrategy.OnPush
// })
// export class OrganisationunitSelectorComponent implements OnInit {
//   @Input()
//   organisationUnits$: Observable<any>;
//   @Input()
//   organisationUnitLevels$: Observable<any>;
//   @Input()
//   assignedLowestLevel$: Observable<number>;
//   organisationUnitLevels: any[] = [];
//   organisationUnits: any;
//   orgunitChildrenLevels: any[] = [];
//   lowestAssignedLevel: number = 4;
//   selectedChildrenLevel: number = 0;
//   @Output() onOrgUnitSelectionChange: EventEmitter<any> = new EventEmitter<
//     any
//   >();
//   selectedOrganisationUnits: any[] = [];
//   @ViewChild("orgtree")
//   orgtree: TreeComponent;
//   constructor(private ref: ChangeDetectorRef) {}

//   ngOnInit() {
//     this.organisationUnits$.subscribe(organisationUnits => {
//       this.organisationUnits = organisationUnits;
//       if (organisationUnits.length > 0) {
//         this.selectedOrganisationUnits = [this.organisationUnits[0]];
//         this.activateNode(this.selectedOrganisationUnits[0].id, this.orgtree);
//         this.onOrgUnitSelectionChange.emit({
//           selectedOrgUnit: this.selectedOrganisationUnits,
//           selectedChildrenLevel: this.selectedChildrenLevel
//         });
//       }
//       this.organisationUnitLevels$.subscribe(
//         (organisationUnitLevels: any[]) => {
//           this.assignedLowestLevel$.subscribe(assignedLowestLevel => {
//             if (assignedLowestLevel > 0 && organisationUnitLevels.length > 0) {
//               this.organisationUnitLevels = organisationUnitLevels;
//               this.lowestAssignedLevel = assignedLowestLevel;
//               this.orgunitChildrenLevels = this.getOrgUnitChildrenLevel(
//                 this.organisationUnitLevels,
//                 this.selectedOrganisationUnits,
//                 this.lowestAssignedLevel
//               );
//               if (this.orgunitChildrenLevels.length > 0) {
//                 this.selectedChildrenLevel = this.orgunitChildrenLevels[0].level;
//               } else {
//                 this.selectedChildrenLevel = 0;
//               }
//               this.onOrgUnitSelectionChange.emit({
//                 selectedOrgUnit: this.selectedOrganisationUnits,
//                 selectedChildrenLevel: this.selectedChildrenLevel
//               });
//             }
//             this.ref.markForCheck();
//           });
//         }
//       );
//     });
//   }

//   activateOrganisationUnit(event) {
//     this.selectedOrganisationUnits = [event.node.data];
//     this.orgunitChildrenLevels = this.getOrgUnitChildrenLevel(
//       this.organisationUnitLevels,
//       this.selectedOrganisationUnits,
//       this.lowestAssignedLevel
//     );
//     if (this.orgunitChildrenLevels.length > 0) {
//       this.selectedChildrenLevel = this.orgunitChildrenLevels[0].level;
//     } else {
//       this.selectedChildrenLevel = 0;
//     }
//     this.onOrgUnitSelectionChange.emit({
//       selectedOrgUnit: this.selectedOrganisationUnits,
//       selectedChildrenLevel: this.selectedChildrenLevel
//     });
//   }

//   deactivateOrganisationUnit(event) {
//     this.selectedOrganisationUnits.splice(
//       this.selectedOrganisationUnits.indexOf(event.node.data),
//       1
//     );
//     this.onOrgUnitSelectionChange.emit({
//       selectedOrgUnit: this.selectedOrganisationUnits,
//       selectedChildrenLevel: this.selectedChildrenLevel
//     });
//   }

//   updateChildrenLevel(selectedChildrenLevel) {
//     this.selectedChildrenLevel = parseInt(selectedChildrenLevel);
//     this.onOrgUnitSelectionChange.emit({
//       selectedOrgUnit: this.selectedOrganisationUnits,
//       selectedChildrenLevel: this.selectedChildrenLevel
//     });
//   }

//   getOrgUnitChildrenLevel(
//     orgunitLevels,
//     selectedOrgunit,
//     lowestAssignedLevel
//   ): any {
//     let childrenLevel: any[] = [];
//     let levelCount: number = orgunitLevels.length;

//     if (selectedOrgunit.length > 0) {
//       for (let i: number = selectedOrgunit[0].level + 1; i <= levelCount; i++) {
//         childrenLevel.push(this.getLevelDetails(i, orgunitLevels));
//       }
//     }
//     return childrenLevel.filter(levelDetail => {
//       return levelDetail.level <= lowestAssignedLevel;
//     });
//   }

//   getLevelDetails(level, orgunitLevels): string {
//     let levelDetails: string = "None";
//     orgunitLevels.forEach(orgunitLevel => {
//       if (orgunitLevel.level === level) {
//         levelDetails = orgunitLevel;
//       }
//     });
//     return levelDetails;
//   }

//   activateNode(nodeId: any, nodes) {
//     setTimeout(() => {
//       let node = nodes.treeModel.getNodeById(nodeId);
//       if (node) node.setIsActive(true, true);
//     }, 0);
//   }

//   getChildLevelName(childrenLevel: any, selectedOrganisationUnitLevel) {
//     let childrenName: string = "";

//     if (selectedOrganisationUnitLevel === 1) {
//       childrenName = "Show ";
//       childrenName +=
//         childrenLevel.name === "District"
//           ? "Regions and "
//           : childrenLevel.name === "Ward"
//           ? "Districts and "
//           : "";
//       childrenName +=
//         childrenLevel.name == "Regional" ? "Region" : childrenLevel.name;
//       childrenName += "s";
//     } else if (selectedOrganisationUnitLevel == 2) {
//       childrenName = "Show ";
//       childrenName += childrenLevel.name === "Ward" ? "Districts and " : "";
//       childrenName += childrenLevel.name;
//       childrenName += "s";
//     } else if (selectedOrganisationUnitLevel == 3) {
//       childrenName = "Show ";
//       childrenName += childrenLevel.name === "Ward" ? "Districts and " : "";
//       childrenName += childrenLevel.name;
//       childrenName += "s";
//     }
//     return childrenName;
//   }
// }
