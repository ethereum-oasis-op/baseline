R.<a,d,x1,y1,x2,y2> = QQ[]
S = R.quotient([a*x1^2+y1^2-1+d*x1^2*y1^2, a*x2^2+y2^2-1+d*x2^2*y2^2])
 
# the Edwards addition law:
x3 = (x1*y2+y1*x2)/(1+d*x1*x2*y1*y2)
y3 = (y1*y2-a*x1*x2)/(1-d*x1*x2*y1*y2)
