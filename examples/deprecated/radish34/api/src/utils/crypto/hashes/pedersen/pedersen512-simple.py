#!/usr/bin/env python3
# -*- coding: utf-8 -*-

from zokrates_pycrypto.gadgets.pedersenHasher import PedersenHasher
import bitstring
import numpy as np

entropy = np.random.bytes(64)
hasher = PedersenHasher("test")
digest = hasher.hash_bytes(entropy)

entropy_bits = bitstring.BitArray(bytes=entropy).bin
digest_bits = bitstring.BitArray(bytes=digest.compress()).bin

print(entropy_bits)
print(digest_bits)
