const queries = [
  {
    query: "SELECT direccion_textual, latitud, longitud FROM oficina",
  },
  {
    query:
      "SELECT direccion_textual, latitud, longitud, dias_aplicables, hora_apertura, hora_cierre FROM oficina LEFT JOIN oficina_horario ON oficina.id = oficina_horario.id",
  },
  {
    query: `SELECT 
    o.direccion_textual,
    o.longitud,
    o.latitud,
    oh.dias_aplicables,
    oh.hora_apertura,
    oh.hora_cierre,
    STRING_AGG(t.descripcion, ', ') AS tramites_disponibles
FROM 
    public.oficina o
JOIN 
    public.oficina_horario oh ON o.id = oh.oficina_id
JOIN 
    public.oficina_tramite ot ON o.id = ot.oficina_id
JOIN 
    public.tramite t ON ot.tramite_id = t.id
GROUP BY 
    o.id, 
    o.nombre, 
    o.zona, 
    oh.dias_aplicables, 
    oh.hora_apertura, 
    oh.hora_cierre;`,
  },
  {
    query: "SELECT * FROM public.prueba",
  },
];

export { queries };
