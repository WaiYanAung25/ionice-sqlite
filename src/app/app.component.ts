import { Component } from '@angular/core';
import { SqliteService } from './services/employee-mobile.service';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private sqliteService: SqliteService,
    private platform: Platform
  ) {
    this.platform.ready().then(() => {
      if (this.platform.is('mobile')) {
        this.initApp();
      } else {
        // Use local storage logic for web
      }
    });
  }
  async initApp() {
    await this.sqliteService.initializePlugin();
  }
}
