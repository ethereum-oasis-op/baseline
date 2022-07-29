
pragma circom 2.0.0;

template AppointmentAvailable() {
  signal input availableTimesSetterStart[5]; // private input
  signal input availableTimesSetterEnd[5]; // private input
  signal input availableTimeGetterStart[5]; // private input
  signal input availableTimeGetterEnd[5]; // private input
  
  signal output out;
  var flag = 0;
  for(var i = 0; i < n; i++){
        for(var j=0;j<m;j++){
            if(!flag && availableTimesSetterStart[i] == availableTimeGetterStart[j] && availableTimeGetterEnd[i] == availableTimesSetterEnd[j]){
                flag = !flag;
        }
    }
  }
  out <-- flag;
}
 
component main = AppointmentAvailable();