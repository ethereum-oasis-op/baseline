#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import sys
import hashlib

preimage = bytes.fromhex('00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 05')

digest = hashlib.sha256(preimage).hexdigest()

h = int(digest[:32], 16), int(digest[32:], 16)

print(h)
