export const LmsrMarketMakerContractData = {
  address: '0x9561C133DD8580860B6b7E504bC5Aa500f0f06a7',
  abi: [
    {
      constant: true,
      inputs: [],
      name: 'implementationMaster',
      outputs: [
        {
          name: '',
          type: 'address',
        },
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'constructor',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          name: 'creator',
          type: 'address',
        },
        {
          indexed: false,
          name: 'lmsrMarketMaker',
          type: 'address',
        },
        {
          indexed: false,
          name: 'pmSystem',
          type: 'address',
        },
        {
          indexed: false,
          name: 'collateralToken',
          type: 'address',
        },
        {
          indexed: false,
          name: 'conditionIds',
          type: 'bytes32[]',
        },
        {
          indexed: false,
          name: 'fee',
          type: 'uint64',
        },
        {
          indexed: false,
          name: 'funding',
          type: 'uint256',
        },
      ],
      name: 'LMSRMarketMakerCreation',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          name: 'previousOwner',
          type: 'address',
        },
        {
          indexed: true,
          name: 'newOwner',
          type: 'address',
        },
      ],
      name: 'OwnershipTransferred',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          name: 'initialFunding',
          type: 'uint256',
        },
      ],
      name: 'AMMCreated',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          name: 'target',
          type: 'address',
        },
        {
          indexed: false,
          name: 'clone',
          type: 'address',
        },
      ],
      name: 'CloneCreated',
      type: 'event',
    },
    {
      constant: false,
      inputs: [
        {
          name: 'consData',
          type: 'bytes',
        },
      ],
      name: 'cloneConstructor',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        {
          name: 'pmSystem',
          type: 'address',
        },
        {
          name: 'collateralToken',
          type: 'address',
        },
        {
          name: 'conditionIds',
          type: 'bytes32[]',
        },
        {
          name: 'fee',
          type: 'uint64',
        },
        {
          name: 'whitelist',
          type: 'address',
        },
        {
          name: 'funding',
          type: 'uint256',
        },
      ],
      name: 'createLMSRMarketMaker',
      outputs: [
        {
          name: 'lmsrMarketMaker',
          type: 'address',
        },
      ],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
  ],
};

export const FixedProductMarketMakerContractData = {
  address: '0x000000',
  abi: [
    {
      inputs: [
        { internalType: 'address', name: '_outcomeToken', type: 'address' },
        { internalType: 'uint256', name: '_amount', type: 'uint256' },
      ],
      name: 'buyOutcomeTokens',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'address', name: '_outcomeToken', type: 'address' },
        { internalType: 'uint256', name: '_amount', type: 'uint256' },
      ],
      name: 'sellOutcomeTokens',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
  ],
};
