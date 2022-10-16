export function buf2hex(ar: Uint8Array): string {
  return [...ar].map((x) => x.toString(16).padStart(2, '0')).join(':')
}

export function objectIsEqual(obj1: unknown, obj2: unknown): boolean {
  return JSON.stringify(obj1) === JSON.stringify(obj2)
}

export function getLongFromArray(array: Uint8Array, startbyte: number): number {
  const arr = array
  let num = arr[startbyte + 3] << 24
  num = num | (arr[startbyte + 2] << 16)
  num = num | (arr[startbyte + 1] << 8)
  num = num | arr[startbyte]
  return num
}

export function getIntFromArray(array: Uint8Array, startbyte: number): number {
  let num = array[startbyte + 1] << 8
  num = num | array[startbyte]
  return num
}

export function splitArraytoSubarray(input_arr: Uint8Array, bytesLength: number): Uint8Array[] {
  const output_arr = []
  const err_count = Math.round(input_arr.length / bytesLength)
  if (input_arr.length > 0) {
    for (let i = 0; i < err_count; i++) {
      const start = i * bytesLength
      const end = start + bytesLength
      output_arr.push(input_arr.subarray(start, end) as never)
    }
  }
  return output_arr
}

export function getBitsValue(srcValue: number, startBit: number, lengthBit: number): number {
  let mask = 0
  let out
  for (let i = 0; i < lengthBit; i++) {
    mask = mask | (1 << (startBit + i))
  }
  out = srcValue & mask
  out = out >> startBit
  return out
}

export function getMaxFromBitsLength(bitsLength: number): number {
  let out = 0
  for (let i = 0; i < bitsLength; i++) {
    out ^= (-1 ^ out) & (1 << i)
  }
  return out
}

export function setBitsValue(destValue: number, startBit: number, lengthBit: number, value: number): number {
  let outVal = destValue
  const valBstr = value.toString(2).padStart(lengthBit, '0')
  for (let i = 0; i < valBstr.length; i++) {
    if (i > lengthBit) break
    const bitVal = Number.parseInt(valBstr[i])
    outVal ^= (-bitVal ^ outVal) & (1 << (i + startBit))
  }
  return outVal
}
