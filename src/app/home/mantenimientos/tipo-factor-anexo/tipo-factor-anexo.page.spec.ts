import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TipoFactorAnexoPage } from './tipo-factor-anexo.page';

describe('TipoFactorAnexoPage', () => {
  let component: TipoFactorAnexoPage;
  let fixture: ComponentFixture<TipoFactorAnexoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TipoFactorAnexoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TipoFactorAnexoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
