# Refinar transición de pago

## Cambios
- Añadir un estado de procesamiento compartido para tarjeta y Yape.
- Mostrar una capa centrada con spinner y “Procesando pago...” durante 3 segundos.
- Cambiar la misma capa a “¡Pago exitoso!” con check durante 1 segundo.
- Registrar el pedido, vaciar el carrito y navegar a `/checkout/exito` al finalizar.
- Bloquear acciones repetidas mientras el pago se procesa.

## Validación
- Probar tarjeta: selección, formulario, confirmación, transición y página de éxito.
- Probar Yape: selección, referencia, transición y página de éxito.
- Confirmar que el resumen se conserva en éxito y el carrito queda vacío.
- Revisar escritorio/móvil y errores de compilación o ejecución.

## Detalles técnicos
- Los temporizadores se limpian al desmontar la página para evitar navegaciones tardías.
- El pedido se crea justo antes de navegar, preservando sus artículos para el resumen final.
