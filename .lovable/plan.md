# Boleta electrónica al completar la compra

## Cambios
- Ampliar el pedido guardado al pagar con un número de boleta de seis dígitos y la fecha/hora de emisión, para que permanezcan estables en la pantalla y el PDF.
- Rediseñar `/checkout/exito` como una boleta peruana clara e imprimible con empresa, RUC, cliente, DNI simulado, método de pago y detalle de productos o membresías.
- Calcular el valor gravado y el IGV del 18% desde el total pagado, manteniendo exactamente el total original.
- Añadir “Descargar Boleta (PDF)” y “Volver a la Tienda” debajo del comprobante.
- Mantener una alternativa clara cuando no exista un pedido reciente.

## Validación
- Completar una compra y comprobar que número, fecha, cliente, método, artículos y totales coincidan.
- Descargar y revisar visualmente el PDF completo.
- Revisar la página en escritorio y móvil, además de errores de compilación o ejecución.

## Detalles técnicos
- El PDF se generará en el navegador a partir del pedido ya confirmado, sin enviar datos del cliente a servicios externos.
- El DNI será ficticio y estará marcado como dato de demostración dentro del prototipo.
