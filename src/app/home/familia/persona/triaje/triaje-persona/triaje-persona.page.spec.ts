import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TriajePersonaPage } from './triaje-persona.page';

describe('TriajePersonaPage', () => {
  let component: TriajePersonaPage;
  let fixture: ComponentFixture<TriajePersonaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TriajePersonaPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TriajePersonaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
