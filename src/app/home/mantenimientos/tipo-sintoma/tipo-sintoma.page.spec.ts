import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TipoSintomaPage } from './tipo-sintoma.page';

describe('TipoSintomaPage', () => {
  let component: TipoSintomaPage;
  let fixture: ComponentFixture<TipoSintomaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TipoSintomaPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TipoSintomaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
