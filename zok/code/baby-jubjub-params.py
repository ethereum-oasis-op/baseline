#!/usr/bin/env python3
# -*- coding: utf-8 -*-

def curve_params():

    # Order of the curve E
    JUBJUBE = 21888242871839275222246405745257275088614511777268538073601725287587578984328    
    JUBJUBC = 8         # Cofactor
    JUBJUBA = 168700    # Coefficient A
    JUBJUBD = 168696    # Coefficient D
    MONTA = 168698      # int(2*(JUBJUB_A+JUBJUB_D)/(JUBJUB_A-JUBJUB_D))
    MONTB = 1           # int(4/(JUBJUB_A-JUBJUB_D))
    
    # Point at infinity
    infinity = (0, 1)

    #  Generator
    Gu = 16540640123574156134436876038791482806971768689494387082833631921987005038935
    Gv = 20819045374670962167435360035096875258406992893633759881276124905556507972311

    #        Index
    #          0       1         2            3         4   5      6       7        8      10
    return [JUBJUBA, JUBJUBD, infinity[0], infinity[1], Gu, Gv, JUBJUBE, JUBJUBC, MONTA, MONTB]

context = curve_params()
print(context)


