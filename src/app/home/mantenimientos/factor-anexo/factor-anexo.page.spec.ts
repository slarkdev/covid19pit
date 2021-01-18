import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FactorAnexoPage } from './factor-anexo.page';

describe('FactorAnexoPage', () => {
  let component: FactorAnexoPage;
  let fixture: ComponentFixture<FactorAnexoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FactorAnexoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FactorAnexoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
