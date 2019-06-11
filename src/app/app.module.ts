import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppComponent } from "./app.component";
import { ArdsMenuComponent } from "./components/ards-menu/ards-menu.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { LeftSidebarComponent } from "./components/left-sidebar/left-sidebar.component";
import { RightSidebarComponent } from "./components/right-sidebar/right-sidebar.component";
import { NavMenusComponent } from "./components/nav-menus/nav-menus.component";
import { AnalysisComponent } from "./components/analysis/analysis.component";
import { AnalysisItemComponent } from "./components/analysis-item/analysis-item.component";
import { AnalysisControlsComponent } from "./components/analysis-controls/analysis-controls.component";
import { AnalysisDropdownComponent } from "./components/analysis-dropdown/analysis-dropdown.component";
import { ControlMenuComponent } from "./components/control-menu/control-menu.component";
import { CMSRoutingModule } from "./app-routing.module";
import { ArticleComponent } from "./article/article.component";
import { ReportTablesComponent } from "./components/report-tables/report-tables.component";
import { DocumentsComponent } from "./components/documents/documents.component";
import { LinksComponent } from "./components/links/links.component";
// import { OrganisationunitSelectorComponent } from "./components/organisationunit-selector/organisationunit-selector.component";
import { OrganisationunitLevelSelectorComponent } from "./components/organisationunit-level-selector/organisationunit-level-selector.component";
import { ReportTableService } from "./providers/report-table.service";
import { DocumentService } from "./providers/document.service";
import { LoaderComponent } from "./components/loader/loader.component";
import { LinkService } from "./providers/link.service";
import { MessagesDisplayComponent } from "./components/messages-display/messages-display.component";
import { ChartsDisplayComponent } from "./components/charts-display/charts-display.component";
import { DocumentUpdateComponent } from "./components/document-update/document-update.component";
import { LinksUpdateComponent } from "./components/links-update/links-update.component";
import { ArticleModule } from "./article/article.module";
import { HomeMenuService } from "./providers/homeMenus.service";
import { ArticleService } from "./providers/article.service";
import { ArticleRendererComponent } from "./components/article-renderer/article-renderer.component";
import { CKEditorModule } from "ng2-ckeditor";
import { ArticleUpdateComponent } from "./components/article-update/article-update.component";
import { ArticleAddComponent } from "./components/article-add/article-add.component";
import { MessageService } from "./providers/message.service";
import { SharingService } from "./providers/sharing.service";
import { ChartsUpdateComponent } from "./components/charts-update/charts-update.component";
import { RightMessageDisplayComponent } from "./components/right-message-display/right-message-display.component";
import { SafeHtmlPipe } from "./pipes/safe-html.pipe";
import { SafeTableRowHtmlPipe } from "./pipes/safe-table-row-html.pipe";
import { MultiselectDropdownModule } from "angular-2-dropdown-multiselect";
import { ChartService } from "./providers/chart.service";
@NgModule({
  declarations: [
    AppComponent,
    ArdsMenuComponent,
    AnalysisComponent,
    AnalysisItemComponent,
    AnalysisControlsComponent,
    AnalysisDropdownComponent,
    // OrganisationunitSelectorComponent,
    OrganisationunitLevelSelectorComponent,
    LeftSidebarComponent,
    RightSidebarComponent,
    NavMenusComponent,
    ControlMenuComponent,
    ArticleComponent,
    ReportTablesComponent,
    DocumentsComponent,
    LinksComponent,
    LoaderComponent,
    MessagesDisplayComponent,
    ChartsDisplayComponent,
    DocumentUpdateComponent,
    LinksUpdateComponent,
    ArticleRendererComponent,
    ArticleUpdateComponent,
    ArticleAddComponent,
    ChartsUpdateComponent,
    RightMessageDisplayComponent,
    SafeHtmlPipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    CMSRoutingModule,
    ArticleModule,
    CKEditorModule,
    MultiselectDropdownModule
  ],
  providers: [
    ReportTableService,
    DocumentService,
    LinkService,
    ArticleService,
    HomeMenuService,
    MessageService,
    SharingService,
    ChartService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
