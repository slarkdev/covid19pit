import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TriajePage } from './triaje.page';

describe('TriajePage', () => {
  let component: TriajePage;
  let fixture: ComponentFixture<TriajePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TriajePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TriajePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
