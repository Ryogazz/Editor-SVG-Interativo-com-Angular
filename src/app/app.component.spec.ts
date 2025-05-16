import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { CanvasComponent } from './components/canvas/canvas.component';
import { PropertyPanelComponent } from './components/property-panel/property-panel.component';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AppComponent,
        ToolbarComponent,
        CanvasComponent,
        PropertyPanelComponent
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it(`should have the 'svg-designer' title`, () => {
    expect(component.title).toEqual('svg-designer');
  });

  it('should render the toolbar component', () => {
    const toolbar = fixture.nativeElement.querySelector('app-toolbar');
    expect(toolbar).toBeTruthy();
  });

  it('should have a main layout div', () => {
    const mainLayout = fixture.nativeElement.querySelector('.main-layout');
    expect(mainLayout).toBeTruthy();
  });

  it('should render canvas inside main layout', () => {
    const mainLayout = fixture.nativeElement.querySelector('.main-layout');
    const canvas = mainLayout.querySelector('app-canvas.canvas-area');
    expect(canvas).toBeTruthy();
  });

  it('should render property panel inside main layout', () => {
    const mainLayout = fixture.nativeElement.querySelector('.main-layout');
    const panel = mainLayout.querySelector('app-property-panel.panel-area');
    expect(panel).toBeTruthy();
  });

  it('should have the correct component structure', () => {
    const compiled = fixture.nativeElement;
    const toolbar = compiled.querySelector('app-toolbar');
    const mainLayout = compiled.querySelector('.main-layout');
    
    expect(toolbar).toBeTruthy();
    expect(mainLayout).toBeTruthy();
    
    if (mainLayout) {
      const canvas = mainLayout.querySelector('app-canvas.canvas-area');
      const panel = mainLayout.querySelector('app-property-panel.panel-area');
      
      expect(canvas).toBeTruthy();
      expect(panel).toBeTruthy();
      expect(mainLayout.children.length).toBe(2); 
    }
  });
});