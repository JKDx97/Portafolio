import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  OnInit,
  PLATFORM_ID,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import * as AOS from 'aos';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';
import { translations } from '../translations';
import lottie from 'lottie-web';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './index.component.html',
  styleUrl: './index.component.css',
})
export class IndexComponent {
  title = 'portafolio';
  isHovered = false;
  defaultImage = '/images/yo.png';
  hoverImage = '/images/quebonetoxd.png';
  currentImage = this.defaultImage;
  lang: 'es' | 'en' = 'es';
  t = translations[this.lang];
  email: string = 'hoterosebastian2004@gmail.com';
  copied: boolean = false;
  spainFlag = 'https://flagcdn.com/w40/es.png'; // bandera España (40px ancho)
  ukFlag = 'https://flagcdn.com/w40/gb.png';
  isEnglish = false;
  currentDate = new Date();
  currentTime: string = '';
  dateFormat: string = 'fullDate';
  private timer: any;
  isDownloading = false;

  skills = [
    {
      name: {
        es: 'Trabajo en equipo',
        en: 'Teamwork',
      },
      icon: '🤝',
      percentage: 90,
    },
    {
      name: {
        es: 'Proactividad',
        en: 'Proactivity',
      },
      icon: '🚀',
      percentage: 85,
    },
    {
      name: {
        es: 'Resolución de problemas',
        en: 'Problem Solving',
      },
      icon: '💡',
      percentage: 88,
    },
    {
      name: {
        es: 'Pensamiento lógico',
        en: 'Logical Thinking',
      },
      icon: '🧠',
      percentage: 92,
    },
    {
      name: {
        es: 'Aprendizaje continuo',
        en: 'Continuous Learning',
      },
      icon: '📚',
      percentage: 95,
    },
  ];

  @ViewChildren('circleRef') circles!: QueryList<ElementRef>;
  @ViewChild('lottieContainer', { static: false }) lottieContainer!: ElementRef;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      AOS.init();
      this.updateTime();
      this.timer = setInterval(() => {
        this.updateTime();
      }, 1000);
    }
  }

  ngOnDestroy(): void {
    if (this.timer) clearInterval(this.timer);
  }
  updateTime(): void {
    const now = new Date();
    this.currentDate = now;
    this.currentTime = now.toLocaleTimeString('es-PE', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  }
  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      lottie.loadAnimation({
        container: this.lottieContainer.nativeElement,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: '/images/animation.json', // puedes cambiar esta URL
      });
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const circle = entry.target as HTMLElement;
              const percent = Number(circle.getAttribute('data-percentage'));
              const progress = circle.querySelector(
                '.progress'
              ) as SVGCircleElement;
              const dashoffset = 220 - (220 * percent) / 100;
              progress.style.strokeDashoffset = `${dashoffset}`;
              observer.unobserve(circle);
            }
          });
        },
        { threshold: 0.6 }
      );

      this.circles.forEach((circle) => observer.observe(circle.nativeElement));
    }
  }

  onHover(state: boolean): void {
    this.isHovered = state;
    setTimeout(() => {
      this.currentImage = this.isHovered ? this.hoverImage : this.defaultImage;
    }, 100);
  }
  startTour() {
    const tour = driver({
      showProgress: true,
      steps: [
        {
          element: '#nav-brand',
          popover: {
            title: 'Bienvenido',
            description: 'Este es tu portafolio personal. ¡Vamos a recorrerlo!',
            side: 'bottom',
            align: 'start',
          },
        },
        {
          element: '#hero',
          popover: {
            title: 'Sección de Presentación',
            description:
              'Aquí se muestra tu rol como desarrollador y una breve introducción.',
            side: 'right',
          },
        },
        {
          element: '[data-tour="skills"]',
          popover: {
            title: 'Habilidades',
            description:
              'Sección donde destacas tus habilidades técnicas y blandas.',
            side: 'left',
          },
        },
        {
          element: '[data-tour="projects"]',
          popover: {
            title: 'Proyectos',
            description:
              'Proyectos destacados con tecnologías usadas y enlaces.',
            side: 'bottom',
          },
        },
        {
          element: '[data-tour="studys"]',
          popover: {
            title: 'Estudios',
            description: 'Mis Estudios Institucionales y Profesionales.',
            side: 'bottom',
          },
        },
        {
          element: '[data-tour="contact"]',
          popover: {
            title: 'Contacto',
            description: 'Tus redes sociales y medios de contacto directo.',
            side: 'right',
          },
        },
      ],
    });

    tour.drive(); // Inicia el tour
  }
  toggleLanguage(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.isEnglish = input.checked;

    this.lang = input.checked ? 'en' : 'es';
    this.t = translations[this.lang];
  }

  copyEmail() {
    navigator.clipboard.writeText(this.email).then(() => {
      this.copied = true;
      setTimeout(() => {
        this.copied = false;
      }, 3000);
    });
  }
  downloadCV() {
    this.isDownloading = true;

    setTimeout(() => {
      const link = document.createElement('a');
      this.isDownloading = false;
      link.href = '/images/CV.pdf';
      link.download = 'Mi_CV.pdf';
      link.click();
    }, 2000);
  }
}
