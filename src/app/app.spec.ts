import { ComponentFixture, TestBed } from '@angular/core/testing';
import { App } from './app';
import { PageJeu } from './composant/jeu/page-jeu/page-jeu';

describe('App', () => {

  // test du composant PageJeuComposant et PAS du composant App
  let fixture: ComponentFixture<PageJeu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App, PageJeu],
    }).compileComponents();

    // creation du fixture pour PageJeu et pas pour App
    fixture = TestBed.createComponent(PageJeu);
  });


  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render title', async () => {
    fixture.componentInstance.puzzle = {} as any;

    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    const title = compiled.querySelector('.titre-page');

    expect(title).not.toBeNull();
    expect(title!.textContent).toContain('Puzzle chenille');
  });


  // it('should render title', async () => {
  //   const fixture = TestBed.createComponent(App);
  //   fixture.detectChanges();
  //
  //   await fixture.whenStable();
  //
  //   const compiled = fixture.nativeElement as HTMLElement;
  //   const title = compiled.querySelector('h2');
  //
  //   expect(title).not.toBeNull();
  //   expect(title!.textContent).toContain('Puzzle chenille');
  // });
});
