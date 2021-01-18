import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DistritoPage } from './distrito.page';

describe('DistritoPage', () => {
  let component: DistritoPage;
  let fixture: ComponentFixture<DistritoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DistritoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DistritoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
