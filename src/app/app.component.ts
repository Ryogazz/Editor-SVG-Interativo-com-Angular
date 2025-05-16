import { Component } from '@angular/core';
import { ToolbarComponent } from "./components/toolbar/toolbar.component";
import { CanvasComponent } from "./components/canvas/canvas.component";
import { PropertyPanelComponent } from './components/property-panel/property-panel.component';

@Component({
  selector: 'app-root',
  imports: [ToolbarComponent, CanvasComponent, PropertyPanelComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'svg-designer';
}
