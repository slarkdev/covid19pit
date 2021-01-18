import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SintomaPage } from './sintoma.page';

describe('SintomaPage', () => {
  let component: SintomaPage;
  let fixture: ComponentFixture<SintomaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SintomaPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SintomaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
