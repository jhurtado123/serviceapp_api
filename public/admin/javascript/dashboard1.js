 $(document).ready(function () {

     //ct-visits
     new Chartist.Line('#ct-visits', {
         labels: ['Noviembre', 'Diciembre', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'],
         series: [
    [10, 15, 14, 16, 12, 8, 7, 4]
    , [2, 5, 4, 9, 12, 16, 19, 29]
  ]
     }, {
         top: 0,
         low: 1,
         showPoint: true,
         fullWidth: true,
         plugins: [
    Chartist.plugins.tooltip()
  ],
         axisY: {
             labelInterpolationFnc: function (value) {
                 return (value / 1) + 'k';
             }
         },
         showArea: false
     });

   new Chartist.Line('#ct-services', {
     labels: ['Noviembre', 'Diciembre', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'],
     series: [
       [50, 60, 75, 100, 160, 210, 260, 280]
     ]
   }, {
     top: 0,
     low: 1,
     showPoint: true,
     fullWidth: true,
     plugins: [
       Chartist.plugins.tooltip()
     ],
     axisY: {
       labelInterpolationFnc: function (value) {
         return (value / 1) ;
       }
     },
     showArea: false
   });
     // counter
     $(".counter").counterUp({
         delay: 100,
         time: 1500
     });

     var sparklineLogin = function () {
         $('#sparklinedash').sparkline([0, 5, 6, 10, 9, 12, 4, 9], {
             type: 'bar',
             height: '30',
             barWidth: '4',
             resize: true,
             barSpacing: '5',
             barColor: '#7ace4c'
         });
         $('#sparklinedash2').sparkline([0, 5, 6, 10, 9, 12, 4, 9], {
             type: 'bar',
             height: '30',
             barWidth: '4',
             resize: true,
             barSpacing: '5',
             barColor: '#7460ee'
         });
         $('#sparklinedash3').sparkline([0, 5, 6, 10, 9, 12, 4, 9], {
             type: 'bar',
             height: '30',
             barWidth: '4',
             resize: true,
             barSpacing: '5',
             barColor: '#11a0f8'
         });
         $('#sparklinedash4').sparkline([0, 5, 6, 10, 9, 12, 4, 9], {
             type: 'bar',
             height: '30',
             barWidth: '4',
             resize: true,
             barSpacing: '5',
             barColor: '#f33155'
         });
     }
     var sparkResize;
     $(window).on("resize", function (e) {
         clearTimeout(sparkResize);
         sparkResize = setTimeout(sparklineLogin, 500);
     });
     sparklineLogin();
 });
