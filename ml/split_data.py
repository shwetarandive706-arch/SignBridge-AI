"""
SignBridge AI - Signer-Aware Data Splitter Module
Milestone M2.1: Dataset & Data Pipeline Foundation

Prevents data leakage by ensuring that all samples from any individual signer/person
are assigned strictly to either Train, Validation, or Test splits.
"""

from typing import Dict, List, Tuple, Any
import random
import numpy as np
from ml.config import RANDOM_SEED, TRAIN_RATIO, VAL_RATIO, TEST_RATIO


class SignerAwareSplitter:
    """
    Splits dataset samples into Train, Validation, and Test sets while enforcing signer-level isolation.
    """

    @staticmethod
    def split_by_signer(
        samples: List[Dict[str, Any]],
        train_ratio: float = TRAIN_RATIO,
        val_ratio: float = VAL_RATIO,
        test_ratio: float = TEST_RATIO,
        seed: int = RANDOM_SEED
    ) -> Tuple[List[Dict[str, Any]], List[Dict[str, Any]], List[Dict[str, Any]]]:
        """
        Groups samples by signer_id and distributes signers across train/val/test splits.
        Returns (train_samples, val_samples, test_samples).
        """
        assert abs((train_ratio + val_ratio + test_ratio) - 1.0) < 1e-5, "Split ratios must sum to 1.0"

        random.seed(seed)
        np.random.seed(seed)

        # Group samples by signer_id
        signer_groups: Dict[str, List[Dict[str, Any]]] = {}
        no_signer_samples: List[Dict[str, Any]] = []

        for sample in samples:
            signer_id = sample.get("signer_id")
            if signer_id:
                signer_groups.setdefault(signer_id, []).append(sample)
            else:
                no_signer_samples.append(sample)

        signers = list(signer_groups.keys())
        random.shuffle(signers)

        num_signers = len(signers)

        if num_signers >= 3:
            # Allocate signers to splits based on requested ratios
            n_train = max(1, int(round(num_signers * train_ratio)))
            n_val = max(1, int(round(num_signers * val_ratio)))
            
            # Ensure at least 1 signer in test if total >= 3
            if n_train + n_val >= num_signers:
                n_train = num_signers - 2
                n_val = 1

            train_signers = set(signers[:n_train])
            val_signers = set(signers[n_train:n_train + n_val])
            test_signers = set(signers[n_train + n_val:])

            train_samples = [s for s_id in train_signers for s in signer_groups[s_id]]
            val_samples = [s for s_id in val_signers for s in signer_groups[s_id]]
            test_samples = [s for s_id in test_signers for s in signer_groups[s_id]]

        else:
            # Fallback if fewer than 3 unique signers are present: split sample-by-sample
            all_samples = samples.copy()
            random.shuffle(all_samples)
            n_total = len(all_samples)
            n_train = int(round(n_total * train_ratio))
            n_val = int(round(n_total * val_ratio))

            train_samples = all_samples[:n_train]
            val_samples = all_samples[n_train:n_train + n_val]
            test_samples = all_samples[n_train + n_val:]

        # Handle any fallback samples without signer IDs
        if no_signer_samples:
            random.shuffle(no_signer_samples)
            n_total = len(no_signer_samples)
            n_tr = int(round(n_total * train_ratio))
            n_va = int(round(n_total * val_ratio))
            train_samples.extend(no_signer_samples[:n_tr])
            val_samples.extend(no_signer_samples[n_tr:n_tr + n_va])
            test_samples.extend(no_signer_samples[n_tr + n_va:])

        return train_samples, val_samples, test_samples
