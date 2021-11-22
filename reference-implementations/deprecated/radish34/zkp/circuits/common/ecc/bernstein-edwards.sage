def mynumerator(x):
  if parent(x) == R:
    return x
  return numerator(x)

class fastfrac:
  def __init__(self,top,bot=1):
    if parent(top) == ZZ or parent(top) == R:
      self.top = R(top)
      self.bot = R(bot)
    elif top.__class__ == fastfrac:
      self.top = top.top
      self.bot = top.bot * bot
    else:
      self.top = R(numerator(top))
      self.bot = R(denominator(top)) * bot
  def reduce(self):
    return fastfrac(self.top / self.bot)
  def sreduce(self):
    return fastfrac(I.reduce(self.top),I.reduce(self.bot))
  def iszero(self):
    return self.top in I and not (self.bot in I)
  def isdoublingzero(self):
    return self.top in J and not (self.bot in J)
  def __add__(self,other):
    if parent(other) == ZZ:
      return fastfrac(self.top + self.bot * other,self.bot)
    if other.__class__ == fastfrac:
      return fastfrac(self.top * other.bot + self.bot * other.top,self.bot * other.bot)
    return NotImplemented
  def __sub__(self,other):
    if parent(other) == ZZ:
      return fastfrac(self.top - self.bot * other,self.bot)
    if other.__class__ == fastfrac:
      return fastfrac(self.top * other.bot - self.bot * other.top,self.bot * other.bot)
    return NotImplemented
  def __neg__(self):
    return fastfrac(-self.top,self.bot)
  def __mul__(self,other):
    if parent(other) == ZZ:
      return fastfrac(self.top * other,self.bot)
    if other.__class__ == fastfrac:
      return fastfrac(self.top * other.top,self.bot * other.bot)
    return NotImplemented
  def __rmul__(self,other):
    return self.__mul__(other)
  def __div__(self,other):
    if parent(other) == ZZ:
      return fastfrac(self.top,self.bot * other)
    if other.__class__ == fastfrac:
      return fastfrac(self.top * other.bot,self.bot * other.top)
    return NotImplemented
  def __pow__(self,other):
    if parent(other) == ZZ:
      return fastfrac(self.top ^ other,self.bot ^ other)
    return NotImplemented

def isidentity(x):
  return x.iszero()

def isdoublingidentity(x):
  return x.isdoublingzero()

R.<ua,ud,ux1,uy1,ux2,uy2> = PolynomialRing(QQ,6,order='invlex')
I = R.ideal([
  mynumerator((ua*ux1^2+uy1^2)-(1+ud*ux1^2*uy1^2))
, mynumerator((ua*ux2^2+uy2^2)-(1+ud*ux2^2*uy2^2))
])

J = I + R.ideal([0
, ux1-ux2
, uy1-uy2
])

ua = fastfrac(ua)
ud = fastfrac(ud)
ux1 = fastfrac(ux1)
uy1 = fastfrac(uy1)
ux2 = fastfrac(ux2)
uy2 = fastfrac(uy2)

ux3 = (((ux1*uy2+uy1*ux2)/(fastfrac(1)+ud*ux1*ux2*uy1*uy2))).reduce()
uy3 = (((uy1*uy2-ua*ux1*ux2)/(fastfrac(1)-ud*ux1*ux2*uy1*uy2))).reduce()
ux4 = (((ux1*uy1+uy1*ux1)/(fastfrac(1)+ud*ux1*ux1*uy1*uy1))).reduce()
uy4 = (((uy1*uy1-ua*ux1*ux1)/(fastfrac(1)-ud*ux1*ux1*uy1*uy1))).reduce()
a0 = fastfrac((fastfrac(1)/(ua-ud)))
a1 = fastfrac((fastfrac(0)))
a2 = fastfrac((fastfrac(4)*ua/(ua-ud)-fastfrac(2)))
a3 = fastfrac((fastfrac(0)))
a4 = fastfrac((fastfrac(1)))
a6 = fastfrac((fastfrac(0)))
wu1 = (((fastfrac(1)+uy1)/(fastfrac(1)-uy1))).reduce().sreduce()
wv1 = ((fastfrac(2)*(fastfrac(1)+uy1)/(ux1*(fastfrac(1)-uy1)))).reduce().sreduce()
print isidentity(a0*(wv1^2)+a1*(wu1*wv1)+a3*wv1-(((wu1+a2)*wu1+a4)*wu1+a6))
print isidentity(ux1-(fastfrac(2)*wu1/wv1))
print isidentity(uy1-((wu1-fastfrac(1))/(wu1+fastfrac(1))))
wu2 = (((fastfrac(1)+uy2)/(fastfrac(1)-uy2))).reduce().sreduce()
wv2 = ((fastfrac(2)*(fastfrac(1)+uy2)/(ux2*(fastfrac(1)-uy2)))).reduce().sreduce()
wu3 = (((fastfrac(1)+uy3)/(fastfrac(1)-uy3))).reduce().sreduce()
wv3 = ((fastfrac(2)*(fastfrac(1)+uy3)/(ux3*(fastfrac(1)-uy3)))).reduce().sreduce()
wu4 = (((fastfrac(1)+uy4)/(fastfrac(1)-uy4))).reduce().sreduce()
wv4 = ((fastfrac(2)*(fastfrac(1)+uy4)/(ux4*(fastfrac(1)-uy4)))).reduce().sreduce()
slope = ((wv2-wv1)/(wu2-wu1)).reduce().sreduce()
print isidentity(a0*slope^2+a1*slope-a2-wu1-wu2-wu3)
print isidentity(slope*(wu1-wu3)-wv1-a1*wu3-a3-wv3)
slope = ((fastfrac(3)*wu1^2+fastfrac(2)*a2*wu1+a4-a1*wv1)/(fastfrac(2)*a0*wv1+a1*wu1+a3)).reduce().sreduce()
print isidentity(a0*slope^2+a1*slope-a2-wu1-wu1-wu4)
print isidentity(slope*(wu1-wu4)-wv1-a1*wu4-a3-wv4)
