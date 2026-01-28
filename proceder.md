Quiero hacer una app con persistencia con @mcp:reqmanager: te paso los pasos para que vayas uno a uno. NO PARES HASTA QUE NO TERMINES DE FORMA SECUENCIAL

| **Tarea** | Skill | MCP | Notas |
| --- | --- | --- | --- |
| Generación de requisitos |  |  |  |
| Generación de diseños | stitch-requirements-generator | stitch |  |
| Generación de elementos de configuracion | reqconfig-deployment-manager |  | Elementos conf + composes . No olvides trazar los elementos de configuracion a los composes (traza los reqs de los ec, y luego relaciona el compose con los ec) |
| Crear proyecto de github | compose-repo-generator |  | Crear un repo por compose |
| Implementacion de Requisitos | reqmanager-implementador |  | Actualizar el estado de los reqs

Se puede crear repos y asociarlo? (uno por compose) |
| LA IA DEBE PARAR AQUI Y PEDIR LOS DATOS DE COOLIFY |  |  |  |
| Despliegue de esto | coolify-management |  | .Verificar los despliegue en coolify |
| Pruebas | test-generator |  | diseño de casos de prueba |
| Pruebas | test-executor | chrome mcp | Si falla generar reporte de problema. Luego esto implicara la creacion de tareas para agregar este reporte |
| Reporte de problema |  |  | Si solucionamos tareas asociadas a reportes de problemas deberemos actualizar el estado a completado |
|  |  |  |  |
|  |  |  |  |