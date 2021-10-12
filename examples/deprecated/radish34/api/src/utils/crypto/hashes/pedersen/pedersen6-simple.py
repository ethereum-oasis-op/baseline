#!/usr/bin/env python3
# -*- coding: utf-8 -*-

from zokrates_pycrypto.gadgets.pedersenHasher import PedersenHasher
import bitstring
hasher = PedersenHasher("test", 2)
bs = bitstring.BitArray('0b110000')
hasher.hash_bits(bs)
