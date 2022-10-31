const sentences = [
  "When you have a dream you have got to grab it and never let go",
  "Nothing is impossible. The word itself says i am possible",
  "The bad news is time flies. The good news is that you are the pilot",
  "Keep your face towards the sunshine and shadows will fall behind you",
  "Success is not final, failure is not fatal: it is the courage to continue that counts",
  "At the end of the day, whether or not those people are comfortable with how you're living your life doesn't matter. What matters is whether you're comfortable with it",
  "If you make your internal life a priority, then everything else you need on the outside will be given to you and it will be extremely clear what the next step is",
  "You do not always need a plan. Sometimes you just need to breathe, trust, let go and see what happens",
  "I am not going to continue knocking that old door that doesn't open for me. I am going to create my own door and walk through that"
];

function get3Random(){
  const arr = [];
  var flag = 0;
  for (i = 0; i < 3; i++){
    var idx = Math.floor(Math.random() * sentences.length);
    for (j = 0; j < arr.length; j++){
      if (idx == arr[j]){
        i -= 1;
        flag = 1;
        break;
      }
    }
    if (flag == 0) arr.push(idx);
    flag = 0;
  }
  return arr;
}

module.exports = get3Random;