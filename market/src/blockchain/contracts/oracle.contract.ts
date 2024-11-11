export const UMAOracleAbi = {
  address: '0x11111',
  abi: [
    {
      inputs: [
        { internalType: 'bytes32', name: '_identifier', type: 'bytes32' },
        { internalType: 'uint256', name: '_timestamp', type: 'uint256' },
        { internalType: 'bytes', name: '_ancillaryData', type: 'bytes' },
        { internalType: 'address', name: '_requester', type: 'address' },
        { internalType: 'uint256', name: '_reward', type: 'uint256' },
      ],
      name: 'requestPrice',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'bytes32', name: '_identifier', type: 'bytes32' },
        { internalType: 'uint256', name: '_timestamp', type: 'uint256' },
        { internalType: 'bytes', name: '_ancillaryData', type: 'bytes' },
        { internalType: 'address', name: '_requester', type: 'address' },
      ],
      name: 'settle',
      outputs: [
        { internalType: 'int256', name: 'settledPrice', type: 'int256' },
      ],
      stateMutability: 'nonpayable',
      type: 'function',
    },
  ],
};
