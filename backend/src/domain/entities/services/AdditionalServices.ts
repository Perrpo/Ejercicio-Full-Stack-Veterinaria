import { IServicio } from '../interfaces/IServicio';

export class Vacunacion implements IServicio {
  nombre = 'Vacunación';

  obtenerPrecio(): number {
    return 45000;
  }

  obtenerDuracion(): number {
    return 15;
  }
}

export class Radiografia implements IServicio {
  nombre = 'Radiografía';

  obtenerPrecio(): number {
    return 150000;
  }

  obtenerDuracion(): number {
    return 45;
  }
}

export class AnalisisSangre implements IServicio {
  nombre = 'Análisis de Sangre';

  obtenerPrecio(): number {
    return 80000;
  }

  obtenerDuracion(): number {
    return 20;
  }
}

export class Peluqueria implements IServicio {
  nombre = 'Peluquería';

  obtenerPrecio(): number {
    return 60000;
  }

  obtenerDuracion(): number {
    return 60;
  }
}

export class CirugiaMenor implements IServicio {
  nombre = 'Cirugía Menor';

  obtenerPrecio(): number {
    return 300000;
  }

  obtenerDuracion(): number {
    return 90;
  }
}

export class LimpiezaDental implements IServicio {
  nombre = 'Limpieza Dental';

  obtenerPrecio(): number {
    return 120000;
  }

  obtenerDuracion(): number {
    return 45;
  }
}

export class Urgencias implements IServicio {
  nombre = 'Servicio de Urgencias';

  obtenerPrecio(): number {
    return 200000;
  }

  obtenerDuracion(): number {
    return 60;
  }
}
