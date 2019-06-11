/**
 * Created by kelvin on 08/09/17.
 */
import { NgModule } from "@angular/core";
import { Routes, RouterModule, PreloadAllModules } from "@angular/router";
import { AnalysisComponent } from "./components/analysis/analysis.component";

const routes: Routes = [
  { path: "articles", redirectTo: "/articles/all", pathMatch: "full" },
  {
    path: "messages",
    loadChildren: "app/messages/messages.module#MessagesModule"
  },
  {
    path: "home-page-menus",
    loadChildren: "app/home-menus/home-menus.module#HomeMenusModule"
  },
  {
    path: "information-sharing",
    loadChildren: "app/info-sharing/info-sharing.module#InfoSharingModule"
  },
  { path: "analysis", component: AnalysisComponent, pathMatch: "full" },

  {
    path: "analysis/:analysisGroup/:analysisItemId/:analysisItemName",
    component: AnalysisComponent
  },
  {
    path: "messages",
    loadChildren: "app/messages/messages.module#MessagesModule"
  },
  { path: "", redirectTo: "/articles/all", pathMatch: "full" }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: true,
      preloadingStrategy: PreloadAllModules
    })
  ],
  exports: [RouterModule],
  providers: []
})
export class CMSRoutingModule {}
