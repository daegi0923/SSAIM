package com.e203.document.websocket.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.e203.document.collection.Proposal;
import com.e203.document.service.ProposalService;

import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
public class ProposalWebSocketController {
	private final ProposalService proposalService;
	// WebSocket 메시지 처리
	@MessageMapping("/edit/api/v1/projects/{projectId}/proposal") // WebSocket 메시지 매핑
	@SendTo("/topic/api/v1/projects/{projectId}/proposal") // 구독자에게 보낼 경로
	public String editProposal(@DestinationVariable int projectId
		, @Payload String newContent) {
		return proposalService.updateProposalContent(projectId, newContent).getContent();
	}
}
