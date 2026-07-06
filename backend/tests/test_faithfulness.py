"""
Tests for the faithfulness/heuristic grounding scorer.
"""
import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from services.faithfulness import score, label, _sentences


class TestSentenceSplit:
    def test_basic_split(self):
        sents = _sentences("Hello world this is longer text. This is a test sentence.")
        assert len(sents) >= 2

    def test_min_length_filter(self):
        sents = _sentences("Hi. Hello world! This is a longer sentence that should be kept.")
        assert all(len(s) > 12 for s in sents)

    def test_newline_split(self):
        sents = _sentences("First sentence.\nSecond sentence.")
        assert len(sents) == 2


class TestFaithfulnessScore:
    def test_fully_supported(self):
        context = "PM-KISAN provides Rs 6000 per year to farmers. Eligibility: small and marginal farmers."
        answer = "PM-KISAN provides Rs 6000 per year to farmers."
        sc, grounded, unsupported = score(answer, context)
        assert grounded is True
        assert sc >= 0.5

    def test_invented_numbers_penalized(self):
        context = "PM-KISAN provides Rs 6000 per year."
        answer = "PM-KISAN provides Rs 10000 per year to all farmers."
        sc, grounded, unsupported = score(answer, context)
        assert sc < 0.5

    def test_empty_answer_is_grounded(self):
        sc, grounded, unsupported = score("", "Some context")
        assert grounded is True
        assert sc == 1.0

    def test_empty_context_low_score(self):
        answer = "This is a test sentence that should not be supported."
        sc, grounded, unsupported = score(answer, "")
        assert sc < 0.5

    def test_label_high(self):
        assert label(0.8) == "High"

    def test_label_medium(self):
        assert label(0.6) == "Medium"

    def test_label_low(self):
        assert label(0.3) == "Low"
